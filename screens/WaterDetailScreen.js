import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { addWaterLog, updateWaterGoal, fetchPetById, deleteWaterLog } from '../features/petSlice'; 

export default function WaterDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();

  const pet = useSelector(state => state.pets.pets.find(p => p.id === petId)); 

  const [waterLogs, setWaterLogs] = useState(pet?.waterLogs || []);
  const [waterGoal, setWaterGoal] = useState(pet?.waterGoal || '');
  const [newWaterLog, setNewWaterLog] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [newWaterGoal, setNewWaterGoal] = useState(waterGoal || '');

  useEffect(() => {
    if (petId) {
      console.log('fetching pet by id');
      dispatch(fetchPetById(petId));  
    }
  }, [petId, dispatch]);

  useEffect(() => {
    if (pet) {
      setWaterLogs(pet.waterLogs || []);
      setWaterGoal(pet.waterGoal || '');
    }
  }, [pet]);

  const handleUpdateWaterGoal = () => {
    if (!newWaterGoal) {
      Alert.alert('Error', 'Please enter a valid water goal.');
      return;
    }
    dispatch(updateWaterGoal({ petId, waterGoal: newWaterGoal }));
    setGoalModalVisible(false);
  };

  const handleAddWaterLog = async () => {
    if (!newWaterLog) {
      Alert.alert('Error', 'Please enter a water value.');
      return;
    }
    const newWaterRecord = { value: newWaterLog, date: new Date().toLocaleDateString() };
    await dispatch(addWaterLog({ petId, water: newWaterRecord }));
    setWaterLogs([newWaterRecord, ...waterLogs]);
    setNewWaterLog('');
    setAddModalVisible(false);
  };

  const handleDeleteWaterLog = (waterLogId) => {
    Alert.alert(
      'Delete Water Log',
      'Are you sure you want to delete this water log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteWaterLog({ petId, waterLogId }));
              Alert.alert('Success', 'Water log deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete water log.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderWaterItem = ({ item, index }) => (
    <View style={styles.waterItem}>
      <Text style={styles.waterText}>{`${item.value} L - ${item.date}`}</Text>
      <TouchableOpacity onPress={() => handleDeleteWaterLog(index)} style={styles.deleteButton}>
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
        <Text style={styles.header}>Water Intake</Text>
      </View>

      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>Goal: {waterGoal || 'N/A'} L</Text>
        <Text style={styles.goalText}>Current: {waterLogs[0]?.value || 'N/A'} L</Text>
        <Button
          title="Edit Goal"
          onPress={() => {
            setNewWaterGoal(waterGoal);
            setGoalModalVisible(true);
          }}
          buttonStyle={styles.editButton}
        />
      </View>

      <FlatList
        data={waterLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderWaterItem}
        ListHeaderComponent={<Text style={styles.logHeader}>Water Log</Text>}
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
            placeholder="Water (L)"
            value={newWaterLog}
            onChangeText={setNewWaterLog}
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
            <Button title="Save" onPress={handleAddWaterLog} />
          </View>
        </View>
      </Modal>

      <Modal visible={isGoalModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Edit Goal</Text>
          <TextInput
            placeholder="Goal (L)"
            value={newWaterGoal}
            onChangeText={setNewWaterGoal}
            style={styles.input}
            keyboardType="numeric"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setGoalModalVisible(false)} />
            <Button title="Save" onPress={handleUpdateWaterGoal} />
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
  goalContainer: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  goalText: {
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
  waterItem: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  waterText: {
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
