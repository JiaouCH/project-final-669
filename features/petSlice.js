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
  const updatedExcretionLogs = [excretion, ...(petData.excretionLogs || [])]; // Add new excretion log

  // Update the pet document with the new excretion logs
  await setDoc(petDoc, { ...petData, excretionLogs: updatedExcretionLogs });

  return { id: petId, excretionLogs: updatedExcretionLogs }; // Return updated excretion logs
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
  console.log('updatedExcretionLogs', updatedExcretionLogs);
  // Update the pet document in Firebase
  await setDoc(petDoc, { ...petData, excretionLogs: updatedExcretionLogs });

  return { petId, excretionLogs: updatedExcretionLogs };  // Return the updated excretionLogs
});


export const deletePet = createAsyncThunk(
  'pets/deletePet',
  async (petId, { rejectWithValue }) => {
    try {
      console.log('deletePet', petId);
      const petDocRef = doc(db, 'pets', petId); // 获取对应 petId 的文档引用
      await deleteDoc(petDocRef); // 删除文档

      // 如果删除成功，返回被删除的 petId
      return petId;
    } catch (error) {
      // 如果有错误，打印错误并返回错误信息
      console.error('Error deleting pet:', error);
      return rejectWithValue(error.message);  // 使用 rejectWithValue 返回错误信息
    }
  }
);

export const addWaterLog = createAsyncThunk('pets/addWaterLog', async ({ petId, water }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWaterLogs = [water, ...(petData.waterLogs || [])]; // Add new water log

  // Update the pet document with the new water logs
  await setDoc(petDoc, { ...petData, waterLogs: updatedWaterLogs });

  return { id: petId, waterLogs: updatedWaterLogs }; // Return updated water logs
});

export const deleteWaterLog = createAsyncThunk('pets/deleteWaterLog', async ({ petId, waterLogId }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWaterLogs = petData.waterLogs.filter((_, index) => index !== waterLogId);

  // Update the pet document with the new water logs
  await setDoc(petDoc, { ...petData, waterLogs: updatedWaterLogs });

  return { id: petId, waterLogs: updatedWaterLogs }; // Return updated water logs
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

// Update water goal for a pet
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

  // Update the pet document with the new water goal
  await setDoc(petDoc, updatedPetData);

  return { id: petId, waterGoal };
});
// Add a new pet
export const addPet = createAsyncThunk('pets/addPet', async (petData) => {
  const user = getAuthUser();
  const newPet = { ...petData, ownerId: user.uid, weights: [] }; // Initialize weights as an empty array
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

  // Ensure we keep the weights data intact
  const petSnapshot = await getDoc(petDoc);
  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petDataFromFirestore = petSnapshot.data();

  // Ensure weights are not overwritten (use existing weights if not provided)
  const updatedPetData = {
    ...petDataFromFirestore, // Preserve existing data
    ...petData,               // Update with the new data
    weights: petData.weights || petDataFromFirestore.weights, // Preserve weights
  };

  // Update pet document with the modified data
  await updateDoc(petDoc, updatedPetData);
  return updatedPet; // Return updated pet with new data
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


// Add a weight record to a pet (preserve existing weights)
export const addWeightLog = createAsyncThunk('pets/addWeightLog', async ({ petId, weight }) => {
  const petDoc = doc(db, 'pets', petId);
  const petSnapshot = await getDoc(petDoc);

  if (!petSnapshot.exists()) {
    throw new Error('Pet does not exist!');
  }

  const petData = petSnapshot.data();
  const updatedWeights = [weight, ...(petData.weights || [])];; // Add new weight

  // Use setDoc to update the pet document with the new weights
  await setDoc(petDoc, { ...petData, weights: updatedWeights });

  return { id: petId, weights: updatedWeights }; // Return updated weights
});


export const fetchPets = createAsyncThunk('pets/fetchPets', async () => {
  const user = getAuthUser();
  const petQuery = query(collection(db, 'pets'), where('ownerId', '==', user.uid));

  // Fetch documents from the collection
  const querySnapshot = await getDocs(petQuery);

  // Process each document, including the weights field
  return querySnapshot.docs.map(doc => {
    const petData = doc.data(); // Get the pet data from the document
    return {
      id: doc.id, 
      ...petData,
      weights: petData.weights || []  // Ensure weights is always an array
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
        state.pets = state.pets.filter(pet => pet.id !== action.payload); // 移除已删除的宠物
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
          // Correctly filter and update the excretion logs in the state
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
      });
  },
});

export default petSlice.reducer;
