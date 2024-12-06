import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { addFoodLog, fetchPetById, deleteFoodLog } from '../features/petSlice';

export default function FoodDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();

  const pet = useSelector(state => state.pets.pets.find(p => p.id === petId));

  const [foodLogs, setFoodLogs] = useState(pet?.foodLogs || []);
  const [newFoodAmount, setNewFoodAmount] = useState('');
  const [newFoodType, setNewFoodType] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetById(petId));
    }
  }, [petId, dispatch]);

  useEffect(() => {
    if (pet) {
      setFoodLogs(pet.foodLogs || []);
    }
  }, [pet]);

  const handleAddFoodLog = async () => {
    if (!newFoodAmount || !newFoodType) {
      Alert.alert('Error', 'Please enter all fields.');
      return;
    }
    const newFoodRecord = { amount: newFoodAmount, type: newFoodType, date: new Date().toLocaleDateString() };
    await dispatch(addFoodLog({ petId, food: newFoodRecord }));
    setFoodLogs([newFoodRecord, ...foodLogs]);
    setNewFoodAmount('');
    setNewFoodType('');
    setAddModalVisible(false);
  };

  const handleDeleteFoodLog = (foodLogId) => {
    Alert.alert(
      'Delete Food Log',
      'Are you sure you want to delete this food log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteFoodLog({ petId, foodLogId }));
              Alert.alert('Success', 'Food log deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete food log.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderFoodItem = ({ item, index }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodText}>{`${item.date}: ${item.amount} - ${item.type}`}</Text>
      <TouchableOpacity onPress={() => handleDeleteFoodLog(index)} style={styles.deleteButton}>
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
        <Text style={styles.header}>Food Intake</Text>
      </View>

      <FlatList
        data={foodLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderFoodItem}
        ListHeaderComponent={<Text style={styles.logHeader}>Food Log</Text>}
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
            placeholder="Amount"
            value={newFoodAmount}
            onChangeText={setNewFoodAmount}
            style={styles.input}
          />
          <TextInput
            placeholder="Food Type"
            value={newFoodType}
            onChangeText={setNewFoodType}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
            <Button title="Save" onPress={handleAddFoodLog} />
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
  logHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodItem: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  foodText: {
    flex: 1,
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
});
