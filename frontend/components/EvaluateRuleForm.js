import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EvaluateRuleForm = ({ rules, evaluateRule }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [userData, setUserData] = useState('');

  const handleEvaluate = () => {
    if (selectedRule && userData) {
      try {
        // Convert the string input to JSON before sending it to the backend
        const parsedUserData = JSON.parse(userData);
        evaluateRule(selectedRule, parsedUserData); // Ensure it's passed as JSON object
      } catch (e) {
        Alert.alert('Invalid user data format', 'Please provide valid JSON format for user data.');
      }
    } else {
      Alert.alert('Missing Information', 'Please select a rule and provide user data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Evaluate Rule</Text>
      <Text style={styles.label}>Select Rule:</Text>
      <Picker
        selectedValue={selectedRule}
        onValueChange={(itemValue) => setSelectedRule(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a rule" value={null} />
        {rules.map((rule) => (
          <Picker.Item key={rule._id} label={rule.rule_string} value={rule._id} />
        ))}
      </Picker>
      <TextInput
        value={userData}
        onChangeText={setUserData}
        placeholder="Enter user data in JSON format"
        style={styles.input}
        multiline
      />
      <Button title="Evaluate" onPress={handleEvaluate} color="#2196F3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#666',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top', // Ensures text starts from top
    backgroundColor: '#fff',
  },
});

export default EvaluateRuleForm;
