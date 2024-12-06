import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fetchPetById } from '../features/petSlice'; 
import { useDispatch } from 'react-redux';
import { Icon } from '@rneui/themed';

export default function PetDetailScreen({ route, navigation }) {
  const { pet } = route.params || {};  
  const petId = pet.id;
  const [petData, setPetData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (petId) {
      dispatch(fetchPetById(petId))
        .then((action) => {
          if (action.payload) {
            setPetData(action.payload);  
          }
        })
        .catch((error) => {
          console.error("Error fetching pet data:", error);
        });
    }
  }, [petId, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (petId) {
        dispatch(fetchPetById(petId)).then(action => {
          setPetData(action.payload);  
        });
      }
    });

    return unsubscribe;
  }, [navigation, petId, dispatch]);

  if (!petData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading pet data...</Text>
      </View>
    );
  }

  const getLatestWeight = () => {
    if (petData.weights && petData.weights.length > 0) {
      const sortedWeights = [...petData.weights].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedWeights[0].value;  
    }
    return 'No weight data available';
  };
  
  const getLatestWater = () => {
    if (petData.waterLogs && petData.waterLogs.length > 0) {
      const sortedWaterLogs = [...petData.waterLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedWaterLogs[0].value;  
    }
    return 'No weight data available';
  };

  const handleBackToOverview = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PetOverview')}>
          <Icon name="arrow-back" type="material" color="#51A39D" />
        </TouchableOpacity>
        <Text style={styles.header}>Pet Detail</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('EditScreen', {
              pet: petData,
              isEdit: true,
            })
          }
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: petData.imageUrl }} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{petData.name}</Text>
        <Text style={styles.petDetails}>{petData.breed}</Text>
        <Text style={styles.petDetails}>{petData.age} months</Text>
        <Text style={styles.petDetails}>{petData.gender}</Text>
      </View>
      
      <View style={styles.sections}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            console.log(petId);
            navigation.navigate('WeightDetailScreen', { petId });
          }}
        >
          <View style={styles.weightBox}>
            <Text style={styles.sectionText}>Weight</Text>
            <Text style={styles.weightText}>Current: {getLatestWeight()} kg</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('WaterDetailScreen', { petId: pet.id })}
        >
          <View style={styles.weightBox}>
            <Text style={styles.sectionText}>Water Intake</Text>
            <Text style={styles.weightText}>Recent: {getLatestWater()} L</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.section}
          onPress={() => navigation.navigate('FoodDetailScreen', { petId: pet.id })}
        >
          <Text style={styles.sectionText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.section}
        onPress={() => navigation.navigate('ExcretionDetailScreen', { petId: pet.id })}
        >
          <Text style={styles.sectionText}>Excretion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c2c2',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: '#007BFF',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  editText: {
    fontSize: 18,
    color: '#007BFF',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  petInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  petDetails: {
    fontSize: 16,
    color: 'gray',
  },
  sections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    width: '45%',
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightBox: {
    alignItems: 'center',
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'gray',
    marginTop: 5,
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
  editButton: {
    color: '#51A39D',
    marginTop: 10,
  },
  loading: {
    marginTop: 30,
  }
});
