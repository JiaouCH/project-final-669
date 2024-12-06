import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { addExcretionLog, deleteExcretionLog, fetchPetById } from '../features/petSlice'; 

export default function ExcretionDetailScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();

  const pet = useSelector(state => state.pets.pets.find(p => p.id === petId)); 

  const [excretionLogs, setExcretionLogs] = useState(pet?.excretionLogs || []);
  const [selectedExcretionType, setSelectedExcretionType] = useState(''); 
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetById(petId));  
    }
  }, [petId, dispatch]);

  useEffect(() => {
    if (pet) {
      setExcretionLogs(pet.excretionLogs || []);
    }
  }, [pet]);

  const handleAddExcretionLog = async () => {
    if (!selectedExcretionType) {
      Alert.alert('Error', 'Please select an excretion type.');
      return;
    }
    const currentDate = new Date().toLocaleDateString(); 
    const newExcretionRecord = { value: selectedExcretionType, date: currentDate };
    await dispatch(addExcretionLog({ petId, excretion: newExcretionRecord }));
    setExcretionLogs([newExcretionRecord, ...excretionLogs]);
    setSelectedExcretionType('');
    setAddModalVisible(false);
  };

  const handleDeleteExcretionLog = (excretionLogId) => {
    Alert.alert(
      'Delete Excretion Log',
      'Are you sure you want to delete this excretion log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteExcretionLog({ petId, excretionLogId }));
              Alert.alert('Success', 'Excretion log deleted successfully.');
              setExcretionLogs(excretionLogs.filter((_, index) => index !== excretionLogId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete excretion log.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderExcretionItem = ({ item, index }) => (
    <View style={styles.excretionItem}>
      <Text style={styles.excretionText}>{item.value} - {item.date}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteExcretionLog(index)}
        style={styles.deleteButton}
      >
        <Icon name="delete" type="material" color="#51A39D" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" color="#51A39D" />
        </TouchableOpacity>
        <Text style={styles.header}>Excretion Logs</Text>
      </View>

      {/* Excretion Log Section */}
      <FlatList
        data={excretionLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExcretionItem}
        ListHeaderComponent={<Text style={styles.logHeader}>Excretion Log</Text>}
      />

      {/* Add Log Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Icon name="add" type="material" color="white" />
      </TouchableOpacity>

      {/* Add Log Modal */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Add Excretion Log</Text>
            {/* Excretion Type Options */}
            {['Normal', 'Diarrhea', 'Constipation'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalItem,
                  selectedExcretionType === type && styles.selectedItem,
                ]}
                onPress={() => setSelectedExcretionType(type)}
              >
                <Text style={styles.modalText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setAddModalVisible(false)} />
              <Button title="Save" onPress={handleAddExcretionLog} />
            </View>
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
  excretionItem: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  excretionText: {
    flex: 1,
    fontSize: 16,
    color: 'gray',
  },
  deleteButton: {
    paddingLeft: 10,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    maxHeight: '60%',
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  modalItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 5,
    borderRadius: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#00a0ff', 
    color: '#ffffff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
});
