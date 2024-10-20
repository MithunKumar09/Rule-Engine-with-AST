import re

class Node:
    def __init__(self, node_type, left=None, right=None, value=None):
        self.type = node_type
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

def parse_rule_string(rule_string):
    tokens = re.findall(r"[()']|[^\s()']+", rule_string)

    if not tokens:
        raise ValueError("Rule string is invalid or empty")

    def parse_operand(tokens):
        if len(tokens) < 3:
            raise ValueError("Incomplete operand in rule string")
        operand = tokens.pop(0)
        operator = tokens.pop(0)
        value = tokens.pop(0)
        # Check if the value is numeric (integer or float)
        if re.match(r'^\d+$', value):  # Integer check
            value = int(value)
        elif re.match(r'^\d+\.\d+$', value):  # Float check
            value = float(value)
        else:
            # Remove quotes if it's a string value
            if value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
        return Node('operand', value=f"{operand} {operator} {value}")

    def parse_expression(tokens):
        if not tokens:
            raise ValueError("Empty expression in rule string")

        if tokens[0] == '(':
            tokens.pop(0)
            left = parse_expression(tokens)
            if not tokens:
                raise ValueError("Missing operator in rule string")
            operator = tokens.pop(0)
            right = parse_expression(tokens)
            if not tokens or tokens[0] != ')':
                raise ValueError("Mismatched parentheses in rule string")
            tokens.pop(0)
            return Node('operator', left=left, right=right, value=operator)
        else:
            return parse_operand(tokens)

    def parse_full_rule(tokens):
        left = parse_expression(tokens)
        if tokens and tokens[0] in ('AND', 'OR'):
            operator = tokens.pop(0)
            right = parse_expression(tokens)
            return Node('operator', left=left, right=right, value=operator)
        return left

    return parse_full_rule(tokens)

def create_rule(rule_string):
    return parse_rule_string(rule_string)

def combine_rules(rule_asts):
    if not rule_asts:
        raise ValueError("No rule ASTs provided for combination")

    combined = rule_asts[0]
    for rule_ast in rule_asts[1:]:
        combined = Node('operator', left=combined, right=rule_ast, value='AND')  # Combine with AND for simplicity
    return combined

def evaluate_rule(ast, user_data):
    # Debugging output
    print(f"Evaluating AST: {ast.to_dict()}")

    if ast.type == 'operand':
        # Split operand into field, operator, and value
        operand, operator, value = ast.value.split(' ', 2)

        # Cast user_value to the appropriate type
        user_value = user_data.get(operand)

        # Handle numeric comparisons by casting user_value
        if isinstance(user_value, str) and user_value.isdigit():
            user_value = int(user_value)
        elif isinstance(user_value, str) and re.match(r'^\d+\.\d+$', user_value):
            user_value = float(user_value)

        # Cast the value (from the rule) to the appropriate type
        if value.isdigit():
            value = int(value)
        elif re.match(r'^\d+\.\d+$', value):
            value = float(value)

        # Perform the comparison based on the operator
        if operator == '==':
            return user_value == value
        elif operator == '!=':
            return user_value != value
        elif operator == '>':
            return user_value > value
        elif operator == '<':
            return user_value < value
        elif operator == '>=':
            return user_value >= value
        elif operator == '<=':
            return user_value <= value
        else:
            raise ValueError(f"Invalid operator: {operator}")

    elif ast.type == 'operator':
        # Recursively evaluate left and right nodes
        left_result = evaluate_rule(ast.left, user_data)
        right_result = evaluate_rule(ast.right, user_data)

        if ast.value == 'AND':
            return left_result and right_result
        elif ast.value == 'OR':
            return left_result or right_result
        else:
            raise ValueError(f"Invalid operator type: {ast.value}")

    else:
        raise ValueError(f"Unexpected AST node type for evaluation: {ast.type}")
