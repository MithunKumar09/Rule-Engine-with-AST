import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Alert, StyleSheet, TextInput } from 'react-native';

function RuleList({ rules, deleteRule, toggleRuleStatus, updateRule }) {
  const [editMode, setEditMode] = useState(null); // Track which rule is being edited
  const [editedRule, setEditedRule] = useState(''); // Store the edited rule string
  const [error, setError] = useState(''); // Error message state

  const handleEdit = (ruleId, ruleString) => {
    setEditMode(ruleId);
    setEditedRule(ruleString);
    setError(''); // Clear error on edit
  };

  const handleSave = (ruleId) => {
    // Validation: Rule cannot be empty
    if (editedRule.trim() === '') {
      setError('Rule cannot be empty');
      return;
    }

    updateRule(ruleId, editedRule);
    setEditMode(null);
    setEditedRule('');
    setError(''); // Clear error on successful save
  };

  const handleDelete = (ruleId) => {
    Alert.alert(
      "Delete Rule",
      "Are you sure you want to delete this rule?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => deleteRule(ruleId)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Rules</Text>
      <FlatList
        data={rules}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.ruleItem}>
            {editMode === item._id ? (
              <>
                <TextInput
                  value={editedRule}
                  onChangeText={setEditedRule}
                  style={[styles.editInput, error ? styles.errorInput : null]} // Show error input styling
                  placeholder="Edit rule"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </>
            ) : (
              <Text style={styles.ruleText}>{item.rule_string}</Text>
            )}
            <View style={styles.actions}>
              {editMode === item._id ? (
                <TouchableOpacity onPress={() => handleSave(item._id)} style={styles.saveButton}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleEdit(item._id, item.rule_string)} style={styles.editButton}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              )}
              <Switch
                value={item.status}
                onValueChange={() => toggleRuleStatus(item._id)}
              />
              <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ruleText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  errorInput: {
    borderColor: '#ff4d4d', // Red border for error
  },
  errorText: {
    color: '#ff4d4d',
    marginVertical: 5,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default RuleList;
