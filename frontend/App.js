import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Alert, StyleSheet, FlatList } from 'react-native';
import RuleForm from './components/RuleForm';
import RuleList from './components/RuleList';
import EvaluateRuleForm from './components/EvaluateRuleForm';

function App() {
  const [rules, setRules] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null); // To store both the result and comparison

  useEffect(() => {
    // Fetch initial set of rules from backend
    axios.get('http://192.168.201.187:5001/rules') // Use full backend URL
      .then(res => setRules(res.data))
      .catch(err => {
        Alert.alert('Error', 'Failed to fetch rules. Please try again later.');
        console.error('Error fetching rules:', err);
      });
  }, []);

  const addRule = (ruleString) => {
    axios.post('http://192.168.201.187:5001/create_rule', { rule_string: ruleString })
      .then(res => {
        setRules([...rules, res.data]);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to add rule. Please try again.');
        console.error('Error adding rule:', err.response ? err.response.data : err.message);
      });
  };

  const deleteRule = (ruleId) => {
    axios.delete(`http://192.168.201.187:5001/rules/${ruleId}`)
      .then(() => {
        setRules(rules.filter(rule => rule._id !== ruleId));
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to delete rule. Please try again.');
        console.error('Error deleting rule:', err.response ? err.response.data : err.message);
      });
  };

  const toggleRuleStatus = (ruleId) => {
    axios.patch(`http://192.168.201.187:5001/rules/${ruleId}/toggle_status`)
      .then(res => {
        setRules(rules.map(rule =>
          rule._id === ruleId ? { ...rule, status: res.data.new_status } : rule
        ));
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to update status. Please try again.');
        console.error('Error toggling status:', err.response ? err.response.data : err.message);
      });
  };

  const updateRule = (ruleId, updatedRule) => {
    axios.patch(`http://192.168.201.187:5001/rules/${ruleId}/update`, { rule_string: updatedRule })
      .then(() => {
        setRules(rules.map(rule =>
          rule._id === ruleId ? { ...rule, rule_string: updatedRule } : rule
        ));
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to update rule. Please try again.');
        console.error('Error updating rule:', err.response ? err.response.data : err.message);
      });
  };

  const evaluateRule = async (ruleId, userData) => {
    try {
      const response = await fetch('http://192.168.201.187:5001/evaluate_rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rule_id: ruleId,
          user_data: userData,
        }),
      });

      const responseData = await response.json();
      console.log('Response from backend:', responseData);

      setEvaluationResult(responseData); // Set both result and comparison data

      if (responseData.result) {
        console.log('Rule evaluation passed:', responseData);
      } else {
        console.log('Rule evaluation failed:', responseData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to evaluate rule. Please try again later.');
      console.error('Error evaluating rule:', error);
    }
  };

  const renderContent = () => (
    <>
      <RuleForm addRule={addRule} />
      <RuleList rules={rules} deleteRule={deleteRule} toggleRuleStatus={toggleRuleStatus} updateRule={updateRule} />
      <EvaluateRuleForm rules={rules} evaluateRule={evaluateRule} />
      {/* Display evaluation result with comparison */}
      {evaluationResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Evaluation Result: {evaluationResult.result ? 'True' : 'False'}
          </Text>
          {/* <Text style={styles.comparisonText}>Comparison:</Text>
          <Text style={styles.dataText}>Input Data: {JSON.stringify(evaluationResult.received_data)}</Text>
          <Text style={styles.dataText}>Evaluated Condition: {JSON.stringify(evaluationResult.evaluated_condition)}</Text> */}
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: 'header' }]} // Dummy data to create sections
        renderItem={() => renderContent()}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.headerText}>Rule Engine</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 0,
    textAlign: 'center',
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  comparisonText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  dataText: {
    fontSize: 14,
    marginTop: 5,
    color: '#34495e',
  },
});

export default App;
