# Rule Engine with AST

## Overview
The **Rule Engine with AST** is a powerful application designed to manage, evaluate, and manipulate rules using an Abstract Syntax Tree (AST) approach. This application allows users to create, edit, delete, and evaluate rules against user-defined data, providing an efficient way to implement complex rule logic in a manageable format.

## Features
- **Rule Management**: Users can create, read, update, and delete rules.
- **Rule Evaluation**: Evaluate rules against user-defined JSON data.
- **User-Friendly Interface**: Intuitive forms for adding and editing rules.
- **Error Handling**: Comprehensive error alerts for user inputs.
- **Real-Time Updates**: Dynamic updates to the rule list upon creation or modification.

## Technologies Used
- **Frontend**: React Native
- **Backend**: Flask, Flask-CORS, Flask-PyMongo
- **Database**: MongoDB
- **Environment Management**: dotenv

## Installation

### Prerequisites
- Node.js and npm installed for the React Native frontend.
- Python 3.x and pip installed for the Flask backend.
- MongoDB database setup and running.

### Backend Setup
1. **Clone the repository:**
   ```bash
   - git clone https://github.com/yourusername/rule-engine-ast.git
   - cd rule-engine-ast/backend

### Install the required Python packages:
- pip install flask flask-cors flask-pymongo python-dotenv
- Create a .env file in the backend directory and add your MongoDB URI: MONGO_URI=mongodb://your_mongo_uri_here

### Start the Flask server:
- python app.py

## Frontend Setup
### Navigate to the frontend directory:
- cd ../frontend

### Install the required Node packages:
- npm install

### Start the React Native application:
- npm start

## Usage
- **Adding a Rule:** Enter a rule string in the provided input field and click "Add Rule". Rules must not be empty.
- **Editing a Rule:** Click "Edit" next to a rule to modify it. Save changes or cancel.
- **Deleting a Rule:** Click "Delete" next to a rule and confirm the deletion.
- **Evaluating a Rule:** Select a rule from the dropdown and enter user data in JSON format. Click "Evaluate" to see if the rule passes or fails based on the provided data.

## API Endpoints
- **GET /rules:** Retrieve all rules.
- **POST /create_rule:** Add a new rule.
- **DELETE /rules/<ruleId>:** Delete a specific rule by ID.
- **PATCH /rules/<ruleId>/toggle_status:** Toggle the status of a rule.
- **PATCH /rules/<ruleId>/update:** Update the content of a specific rule.
- **POST /evaluate_rule:** Evaluate a specific rule against user data.

## Contributing
- Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.

## License
- This project is licensed under the MIT License - see the LICENSE file for details.

### Instructions
- Replace the placeholder URL in the installation section with the actual repository URL for your project.
- Adjust any details specific to your project setup or instructions as necessary.







