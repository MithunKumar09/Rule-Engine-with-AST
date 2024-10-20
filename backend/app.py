from flask import Flask, request, jsonify
from models import db, Rule
from ast_engine import create_rule, combine_rules, evaluate_rule
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_pymongo import PyMongo
import re

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Get the MONGO_URI from the environment variable
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
db = mongo.cx['RES']

class Node:
    def __init__(self, node_type, left=None, right=None, value=None):
        self.type = node_type  # "operator" or "operand"
        self.left = left
        self.right = right
        self.value = value

    def to_dict(self):
        return {
            'type': self.type,
            'value': self.value,
            'left': self.left.to_dict() if self.left else None,
            'right': self.right.to_dict() if self.right else None
        }

    @staticmethod
    def from_dict(data):
        if data is None:
            return None
        node_type = data.get('type')
        value = data.get('value')
        left = Node.from_dict(data.get('left'))
        right = Node.from_dict(data.get('right'))
        return Node(node_type, left=left, right=right, value=value)

@app.route('/create_rule', methods=['POST'])
def create_new_rule():
    try:
        rule_string = request.json.get('rule_string')
        if not rule_string:
            raise ValueError("No rule_string provided")
        
        # Replace single '=' with '=='
        rule_string = rule_string.replace("=", "==")

        ast = create_rule(rule_string)
        rule = Rule(ast=ast.to_dict(), rule_string=rule_string, status=True)

        db_collection = db.rules
        result = db_collection.insert_one(rule.to_dict())

        return jsonify({"message": "Rule created", "rule_id": str(result.inserted_id)})
    except Exception as e:
        print(f"Error creating rule: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
# New route to fetch all rules
@app.route('/rules', methods=['GET'])
def get_rules():
    try:
        db_collection = db.rules
        rules = list(db_collection.find({}))  # Fetch all rules from the collection

        # Convert ObjectId to string for JSON serialization
        for rule in rules:
            rule['_id'] = str(rule['_id'])
            rule['status'] = rule.get('status', True)  # Ensure status field exists and defaults to True

        return jsonify(rules), 200
    except Exception as e:
        print(f"Error fetching rules: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/rules/<rule_id>/toggle_status', methods=['PATCH'])
def toggle_status(rule_id):
    try:
        db_collection = db.rules
        rule = db_collection.find_one({"_id": ObjectId(rule_id)})

        if not rule:
            return jsonify({"message": "Rule not found"}), 404

        # Toggle status
        new_status = not rule.get('status', True)
        db_collection.update_one({"_id": ObjectId(rule_id)}, {"$set": {"status": new_status}})

        return jsonify({"message": "Status updated", "new_status": new_status})
    except Exception as e:
        print(f"Error toggling status: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
@app.route('/rules/<rule_id>', methods=['DELETE'])
def delete_rule(rule_id):
    try:
        db_collection = db.rules
        result = db_collection.delete_one({"_id": ObjectId(rule_id)})

        if result.deleted_count == 1:
            return jsonify({"message": "Rule deleted"})
        else:
            return jsonify({"message": "Rule not found"}), 404
    except Exception as e:
        print(f"Error deleting rule: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
@app.route('/rules/<rule_id>/update', methods=['PATCH'])
def update_rule(rule_id):
    try:
        rule_string = request.json.get('rule_string')
        if not rule_string:
            return jsonify({"message": "No rule_string provided"}), 400

        # Replace single '=' with '==' for evaluation purposes
        rule_string = rule_string.replace("=", "==")
        
        ast = create_rule(rule_string)

        db_collection = db.rules
        result = db_collection.update_one(
            {"_id": ObjectId(rule_id)},
            {"$set": {"rule_string": rule_string, "ast": ast.to_dict()}}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Rule updated"})
        else:
            return jsonify({"message": "Rule not found"}), 404
    except Exception as e:
        print(f"Error updating rule: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

    
@app.route('/evaluate_rule', methods=['POST'])
def evaluate():
    try:
        # Fetch the rule_id and user_data from the request
        rule_id = request.json.get('rule_id')
        user_data = request.json.get('user_data')

        print(f"Received rule_id: {rule_id}")
        print(f"Received user_data: {user_data}")

        # Ensure the rule_id is valid and user_data is provided
        if not rule_id:
            return jsonify({"error": "No rule_id provided"}), 400
        if user_data is None:
            return jsonify({"error": "No user_data provided"}), 400

        # Fetch the rule from the collection
        db_collection = db.rules
        rule = db_collection.find_one({"_id": ObjectId(rule_id)})

        if not rule:
            print(f"Rule not found for ID: {rule_id}")
            return jsonify({"error": "Rule not found"}), 404

        # Parse AST from the rule data
        ast = Node.from_dict(rule['ast'])

        # Ensure user_data is a dictionary (already sent as JSON from frontend)
        if not isinstance(user_data, dict):
            return jsonify({"error": "Invalid user_data format"}), 400

        # Evaluate the rule against the user_data
        result = evaluate_rule(ast, user_data)

        # Return the evaluation result and echo back received data for verification
        return jsonify({"result": result, "received_data": user_data})

    except Exception as e:
        print(f"Error during rule evaluation: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/combine_rules', methods=['POST'])
def combine():
    rule_ids = request.json.get('rule_ids')
    rules = [db.rules.find_one({"_id": ObjectId(id)}) for id in rule_ids]
    
    rule_asts = [Node.from_dict(rule['ast']) for rule in rules]
    combined_ast = combine_rules(rule_asts)
    
    return jsonify({"combined_ast": combined_ast.to_dict()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
