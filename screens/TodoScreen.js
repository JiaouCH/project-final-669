import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, deleteTodo, updateTodo } from '../features/todoSlice';

export default function TodoScreen() {
  const dispatch = useDispatch();
  const { todos, loading } = useSelector((state) => state.todos);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTodo, setNewTodo] = useState({ petName: '', date: '', todo: '' });
  const [editingTodo, setEditingTodo] = useState(null); 

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = async () => {
    if (!newTodo.petName || !newTodo.date || !newTodo.todo) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await dispatch(addTodo(newTodo));
      setIsModalVisible(false);
      setNewTodo({ petName: '', date: '', todo: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await dispatch(deleteTodo(todoId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setNewTodo({
      petName: todo.petName,
      date: todo.date,
      todo: todo.todo,
    });
    setIsModalVisible(true);
  };

  const handleUpdateTodo = async () => {
    if (!newTodo.petName || !newTodo.date || !newTodo.todo) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      await dispatch(updateTodo({ id: editingTodo.id, updatedTodo: newTodo }));
      setIsModalVisible(false);
      setNewTodo({ petName: '', date: '', todo: '' });
      setEditingTodo(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity style={styles.todoContent} onPress={() => handleEditTodo(item)}>
        <View style={styles.nameDateContainer}>
          <Text style={styles.todoPetName}>{item.petName}</Text>
          <Text style={styles.todoDetails}>{item.date}</Text>
        </View>
        <Text style={styles.todoDetails}>{item.todo}</Text>
      </TouchableOpacity>
  
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleDeleteTodo(item.id)} style={styles.deleteButton}>
          <Icon name="delete" type="material" color="#51A39D" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Memo List</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderTodo}
        />
      )}
      <Button
        icon={<Icon name="add" color="white" />}
        buttonStyle={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>{editingTodo ? 'Edit' : 'Add'} Item</Text>
          <TextInput
            placeholder="Pet Name"
            value={newTodo.petName}
            onChangeText={(text) => setNewTodo({ ...newTodo, petName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Date"
            value={newTodo.date}
            onChangeText={(text) => setNewTodo({ ...newTodo, date: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Todo"
            value={newTodo.todo}
            onChangeText={(text) => setNewTodo({ ...newTodo, todo: text })}
            style={styles.input}
          />
          <Button
            title={editingTodo ? 'Save Changes' : 'Save'}
            onPress={editingTodo ? handleUpdateTodo : handleAddTodo}
          />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} type="outline" />
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
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 50,
  },
  todoItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
    alignItems: 'center', 
  },
  todoContent: {
    flex: 2, 
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginRight: 15, 
  },
  nameDateContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5, 
  },

  todoPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10, 
  },

  todoDetails: {
    fontSize: 14,
    color: 'gray',
  },

  buttonsContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
  },

  editButton: {
    marginRight: 10, 
  },

  deleteButton: {
    marginRight: 10, 
  },
  addButton: {
    backgroundColor: '#51A39D',
    borderRadius: 30,
    alignSelf: 'center',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f6c2c2',
  },
  modalHeader: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f4f4f4'
  },
});
