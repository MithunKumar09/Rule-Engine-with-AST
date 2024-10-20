# backend/models.py
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

db = PyMongo()

class Rule:
    def __init__(self, ast, rule_string, status=True):
        self.id = ObjectId()
        self.ast = ast
        self.rule_string = rule_string
        self.status = status

    def to_dict(self):
        return {
            "_id": self.id,
            "ast": self.ast,
            "rule_string": self.rule_string,
            "status": self.status
        }
        