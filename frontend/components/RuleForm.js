import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'; // Import necessary components

function RuleForm({ addRule }) {
  const [ruleString, setRuleString] = useState('');
  const [error, setError] = useState(null); // Track input errors

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (ruleString.trim() === '') {
      setError('Rule cannot be empty');
      return;
    }

    addRule(ruleString);
    setRuleString('');
    setError(null); // Clear any errors after submission
    Alert.alert('Success', 'Rule added successfully!', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Rule</Text>
      
      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        placeholder="Enter rule string"
        value={ruleString}
        onChangeText={(text) => {
          setRuleString(text);
          if (text.trim() !== '') {
            setError(null); // Clear error when user starts typing
          }
        }}
        style={[
          styles.input,
          error ? styles.inputError : null, // Conditional styling for errors
        ]}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Rule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Add subtle shadow for depth
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff4d4d', // Red border when there's an error
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RuleForm;
