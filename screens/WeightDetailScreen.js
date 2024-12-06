import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { addWeightLog, fetchPetById, updateTargetWeight, deleteWeightLog } from '../features/petSlice';

export default function WeightDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();

  const [weights, setWeights] = useState([]);
  const [targetWeight, setTargetWeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isTargetModalVisible, setTargetModalVisible] = useState(false);
  const [newTargetWeight, setNewTargetWeight] = useState(targetWeight || '');

  useEffect(() => {
    dispatch(fetchPetById(petId));  
  }, [petId, dispatch]);

  const pet = useSelector(state => state.pets.pets.find(p => p.id === petId));
  console.log('WeightDetailScreen', pet);

  useEffect(() => {
    if (pet) {
      setWeights(pet.weights || []);
      setTargetWeight(pet.targetWeight || '');
    }
  }, [pet]);

  const handleDeleteWeightLog = (weightLogId) => {
    Alert.alert(
      'Delete Weight Log',
      'Are you sure you want to delete this weight log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteWeightLog({ petId, weightLogId }));
              Alert.alert('Success', 'Weight log deleted successfully.');
              setWeights(weights.filter((_, index) => index !== weightLogId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete weight log.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateTargetWeight = () => {
    if (!targetWeight) {
      Alert.alert('Error', 'Please enter a valid target weight.');
      return;
    }
    dispatch(updateTargetWeight({ petId, targetWeight }));
    setTargetModalVisible(false);
  };

  const handleAddWeight = async () => {
    if (!newWeight) {
      Alert.alert('Error', 'Please enter a weight value.');
      return;
    }
    const newWeightRecord = { value: newWeight, date: new Date().toLocaleDateString() };
    await dispatch(addWeightLog({ petId, weight: newWeightRecord }));
    setWeights([newWeightRecord, ...weights]);
    setNewWeight('');
    setAddModalVisible(false);
  };

  const renderWeightItem = ({ item, index }) => (
    <View style={styles.weightItem}>
      <Text style={styles.weightText}>{`${item.value} kg - ${item.date}`}</Text>
      <TouchableOpacity onPress={() => handleDeleteWeightLog(index)} style={styles.deleteButton}>
        <Icon name="delete" type="material" color="#51A39D" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#51A39D" />
        </TouchableOpacity>
        <Text style={styles.header}>Weight</Text>
      </View>
      <View style={styles.targetContainer}>
        <Text style={styles.targetText}>Target: {targetWeight || 'N/A'} kg</Text>
        <Text style={styles.targetText}>Now: {weights[0]?.value || 'N/A'} kg</Text>
        <Button
  title="Edit Target"
  onPress={() => {
    setNewTargetWeight(targetWeight);
    setTargetModalVisible(true);
  }}
  buttonStyle={styles.editButton}
/>
      </View>
      <FlatList
        data={weights}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWeightItem}
        ListHeaderComponent={<Text style={styles.logHeader}>Weight Log</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Icon name="add" type="material" color="white" />
      </TouchableOpacity>
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Add Log</Text>
          <TextInput
            placeholder="Weight (kg)"
            value={newWeight}
            onChangeText={setNewWeight}
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
            <Button title="Save" onPress={handleAddWeight} />
          </View>
        </View>
      </Modal>
      <Modal visible={isTargetModalVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <Text style={styles.modalHeader}>Edit Target</Text>
    <TextInput
      placeholder="Target (kg)"
      value={newTargetWeight}
      onChangeText={setNewTargetWeight}
      style={styles.input}
      keyboardType="numeric"
    />
    <View style={styles.modalButtons}>
      <Button title="Cancel" onPress={() => setTargetModalVisible(false)} />
      <Button title="Save" onPress={() => {
        if (!newTargetWeight) {
          Alert.alert('Error', 'Please enter a valid target weight.');
          return;
        }
        dispatch(updateTargetWeight({ petId, targetWeight: newTargetWeight }));
        setTargetWeight(newTargetWeight);
        setTargetModalVisible(false);
      }} />
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c2c2',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  targetContainer: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  targetText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#51A39D',
    marginTop: 10,
  },
  logHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weightItem: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    marginBottom: 10,
  },
  weightText: {
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    backgroundColor: '#51A39D',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  input: {
    backgroundColor: '#ffffff',
    width: '80%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  weightItem: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  weightText: {
    flex: 1,
    fontSize: 16,
    color: 'gray',
  },
});
