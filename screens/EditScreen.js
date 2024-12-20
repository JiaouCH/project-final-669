import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { addPet, updatePet } from '../features/petSlice';

export default function EditScreen({ route, navigation }) {
  const { pet, isEdit } = route.params || {};
  const dispatch = useDispatch();

  const [petInfo, setPetInfo] = useState({
    name: '',
    age: '',
    gender: '',
    breed: '',
    imageUrl: null,
    id: null,
  });

  useEffect(() => {
    if (isEdit && pet) {
      setPetInfo({
        name: pet.name,
        age: pet.age,
        gender: pet.gender,
        breed: pet.breed,
        imageUrl: pet.imageUrl,
        id: pet.id,
      });
    }
  }, [isEdit, pet]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPetInfo({ ...petInfo, imageUrl: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!petInfo.name || !petInfo.age || !petInfo.gender || !petInfo.imageUrl) {
      Alert.alert('Error', 'Please fill in all fields and upload an image.');
      return;
    }

    try {
      if (isEdit) {
        const updatedPet = {
          ...pet,
          name: petInfo.name,
          age: petInfo.age,
          gender: petInfo.gender,
          breed: petInfo.breed,
          imageUrl: petInfo.imageUrl,
        };
        
        await dispatch(updatePet(updatedPet));
        navigation.navigate('PetDetailScreen', { pet: petInfo });
      } else {
        const { id, ...newPetWithoutId } = petInfo;
        newPetWithoutId.weights = [];
  
        await dispatch(addPet(newPetWithoutId));
        navigation.navigate('PetOverview');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save pet.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>{isEdit ? 'Update Pet' : 'Add New Pet'}</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {petInfo.imageUrl ? (
          <Image source={{ uri: petInfo.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>+ Upload Photo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Name"
        value={petInfo.name}
        onChangeText={(text) => setPetInfo({ ...petInfo, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={petInfo.age}
        onChangeText={(text) => setPetInfo({ ...petInfo, age: text })}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Gender"
        value={petInfo.gender}
        onChangeText={(text) => setPetInfo({ ...petInfo, gender: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Breed"
        value={petInfo.breed}
        onChangeText={(text) => setPetInfo({ ...petInfo, breed: text })}
        style={styles.input}
      />

      <Button title="Save" onPress={handleSave} buttonStyle={styles.saveButton} />
      <Button
        title="Cancel"
        onPress={() => navigation.goBack()}
        type="outline"
        buttonStyle={styles.cancelButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6c2c2',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  uploadText: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#51A39D',
    marginBottom: 10,
  },
  cancelButton: {
    borderColor: '#51A39D',
  },
});
