import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, doc, updateDoc, addDoc, query, where, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAuthUser } from '../AuthManager';

const db = getFirestore();

export const addExcretionLog = createAsyncThunk('pets/addExcretionLog', async ({ petId, excretion }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedExcretionLogs = [excretion, ...(petData.excretionLogs || [])]; 

  await setDoc(petDoc, { ...petData, excretionLogs: updatedExcretionLogs });

  return { id: petId, excretionLogs: updatedExcretionLogs }; 
});

export const deleteExcretionLog = createAsyncThunk('pets/deleteExcretionLog', async ({ petId, excretionLogId }) => {
  console.log('deleteExcretionLog', petId, excretionLogId);
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedExcretionLogs = petData.excretionLogs.filter((_, index) => index !== excretionLogId);
  await setDoc(petDoc, { ...petData, excretionLogs: updatedExcretionLogs });

  return { petId, excretionLogs: updatedExcretionLogs };  
});

export const deletePet = createAsyncThunk(
  'pets/deletePet',
  async (petId, { rejectWithValue }) => {
    try {
      const petDocRef = doc(db, 'pets', petId); 
      await deleteDoc(petDocRef); 
      return petId;
    } catch (error) {
      return rejectWithValue(error.message);  
    }
  }
);

//add a water log to the firebase
export const addWaterLog = createAsyncThunk('pets/addWaterLog', async ({ petId, water }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWaterLogs = [water, ...(petData.waterLogs || [])]; 
  await setDoc(petDoc, { ...petData, waterLogs: updatedWaterLogs });

  return { id: petId, waterLogs: updatedWaterLogs }; 
});

export const deleteWaterLog = createAsyncThunk('pets/deleteWaterLog', async ({ petId, waterLogId }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWaterLogs = petData.waterLogs.filter((_, index) => index !== waterLogId);
  await setDoc(petDoc, { ...petData, waterLogs: updatedWaterLogs });

  return { id: petId, waterLogs: updatedWaterLogs }; 
});

export const addFoodLog = createAsyncThunk('pets/addFoodLog', async ({ petId, food }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const newFoodLog = { ...food, date: new Date().toLocaleDateString() }; 
  const updatedFoodLogs = [newFoodLog, ...(petData.foodLogs || [])]; 
  await setDoc(petDoc, { ...petData, foodLogs: updatedFoodLogs });

  return { id: petId, foodLogs: updatedFoodLogs }; 
});

export const deleteFoodLog = createAsyncThunk('pets/deleteFoodLog', async ({ petId, foodLogId }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedFoodLogs = petData.foodLogs.filter((_, index) => index !== foodLogId);
  await setDoc(petDoc, { ...petData, foodLogs: updatedFoodLogs });

  return { id: petId, foodLogs: updatedFoodLogs }; 
});

export const deleteWeightLog = createAsyncThunk('pets/deleteWeightLog', async ({ petId, weightLogId }) => { 
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWeights = petData.weights.filter((_, index) => index !== weightLogId);
  await setDoc(petDoc, { ...petData, weights: updatedWeights });

  return { id: petId, weights: updatedWeights }; 
}
);

export const updateWaterGoal = createAsyncThunk('pets/updateWaterGoal', async ({ petId, waterGoal }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedPetData = {
    ...petData,
    waterGoal,
  };
  await setDoc(petDoc, updatedPetData);

  return { id: petId, waterGoal };
});

export const addPet = createAsyncThunk('pets/addPet', async (petData) => {
  const user = getAuthUser();
  const newPet = { ...petData, ownerId: user.uid, weights: [] }; 
  const docRef = await addDoc(collection(db, 'pets'), newPet);
  return { id: docRef.id, ...newPet };
});

export const fetchPetById = createAsyncThunk('pets/fetchPetById', async (petId) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);
  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }
  const petData = petSnapshot.data();
  return { id: petSnapshot.id, ...petData };
});

export const updatePet = createAsyncThunk('pets/updatePet', async (updatedPet) => {
  console.log('updatedPet', updatedPet);
  const { id, ...petData } = updatedPet;
  const petDoc = doc(db, 'pets', id);

  const petSnapshot = await getDoc(petDoc);
  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petDataFromFirestore = petSnapshot.data();

  const updatedPetData = {
    ...petDataFromFirestore, 
    ...petData,               
    weights: petData.weights || petDataFromFirestore.weights, 
  };

  await updateDoc(petDoc, updatedPetData);
  return updatedPet; 
});

export const updateTargetWeight = createAsyncThunk('pets/updateTargetWeight', async ({ petId, targetWeight }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);
  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }
  const petData = petSnapshot.data();
  const updatedPetData = {
    ...petData,
    targetWeight,
  };
  await setDoc(petDoc, updatedPetData);
  return { id: petId, targetWeight };
});

export const addWeightLog = createAsyncThunk('pets/addWeightLog', async ({ petId, weight }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWeights = [weight, ...(petData.weights || [])];; 

  await setDoc(petDoc, { ...petData, weights: updatedWeights });

  return { id: petId, weights: updatedWeights }; 
});

export const fetchPets = createAsyncThunk('pets/fetchPets', async () => {
  const user = getAuthUser();
  const petQuery = query(collection(db, 'pets'), where('ownerId', '==', user.uid));

  const querySnapshot = await getDocs(petQuery);

  return querySnapshot.docs.map(doc => {
    const petData = doc.data(); 
    return {
      id: doc.id, 
      ...petData,
      weights: petData.weights || []  
    };
  });
});

const petSlice = createSlice({
  name: 'pets',
  initialState: {
    pets: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload;
      })
      .addCase(fetchPets.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.pets.push(action.payload);
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter(pet => pet.id !== action.payload); 
      })
      .addCase(updateTargetWeight.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].targetWeight = action.payload.targetWeight;
        }
      })
      .addCase(addWeightLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].weights = action.payload.weights;
        }
      })
      .addCase(addWaterLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].waterLogs = action.payload.waterLogs;
        }
      })
      .addCase(updateWaterGoal.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].waterGoal = action.payload.waterGoal;
        }
      })
      .addCase(addExcretionLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].excretionLogs = action.payload.excretionLogs;
        }
      })
      .addCase(deleteExcretionLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.petId);
        if (index !== -1) {
          state.pets[index].excretionLogs = action.payload.excretionLogs;
        }
      })
      .addCase(deleteWeightLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].weights = action.payload.weights;
        }
      })
      .addCase(deleteWaterLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].waterLogs = action.payload.waterLogs;
        }
      })
      .addCase(addFoodLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].foodLogs = action.payload.foodLogs;
        }
      })
      .addCase(deleteFoodLog.fulfilled, (state, action) => {
        const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
        if (index !== -1) {
          state.pets[index].foodLogs = action.payload.foodLogs;
        }
      });
  },
});

export default petSlice.reducer;
