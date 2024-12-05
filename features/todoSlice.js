import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { getAuthUser } from '../AuthManager';

const db = getFirestore();

// Fetch todos for the current user
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const user = getAuthUser();
  const todoQuery = query(collection(db, 'todos'), where('ownerId', '==', user.uid));
  const querySnapshot = await getDocs(todoQuery);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Add a new todo
export const addTodo = createAsyncThunk('todos/addTodo', async (todo) => {
  const user = getAuthUser();
  const newTodo = { ...todo, ownerId: user.uid }; // Associate todo with the current user
  const docRef = await addDoc(collection(db, 'todos'), newTodo);
  return { id: docRef.id, ...newTodo };
});

// Delete a todo
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (todoId) => {
  await deleteDoc(doc(db, 'todos', todoId));
  return todoId;
});

// Update a todo
export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, updatedTodo }) => {
  const todoRef = doc(db, 'todos', id);
  await updateDoc(todoRef, updatedTodo);
  return { id, ...updatedTodo };
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index >= 0) {
          state.todos[index] = action.payload;
        }
      });
  },
});

export default todoSlice.reducer;
