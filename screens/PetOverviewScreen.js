import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets, deletePet } from '../features/petSlice';
import { signOut } from '../AuthManager';

function PetOverviewScreen({ navigation }) {
  const dispatch = useDispatch();
  const { pets } = useSelector((state) => state.pets || { pets: [] });

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Sign Out Error', error.message, [{ text: 'OK' }]);
    }
  };

  const handleDelete = (petId) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deletePet(petId));
              Alert.alert('Success', 'Pet deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete pet.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate('PetDetailScreen', { pet: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>{item.breed}</Text>
        <Text style={styles.petDetails}>{item.age} months</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Icon name="delete" type="material" color="#51A39D" containerStyle={styles.deleteIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Icon name="logout" type="material" color="#fff" />
      </TouchableOpacity>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.header}>Pet Overview</Text>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
      />
      <Button
        icon={<Icon name="add" color="white" />}
        buttonStyle={styles.addButton}
        onPress={() => navigation.navigate('EditScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c2c2',
    padding: 20,
    justifyContent: 'flex-start',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 40,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  petDetails: {
    fontSize: 14,
    color: 'gray',
  },
  deleteIcon: {
    padding: 5,
  },
  addButton: {
    backgroundColor: '#51A39D',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 20,
  },
  signOutButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#51A39D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default PetOverviewScreen;
