import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // adjust the path if needed

// Async thunk to fetch food items
export const fetchFoodItems = createAsyncThunk('food/fetchFoodItems', async (_, { rejectWithValue }) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'foodItems'));
    const foodItems = [];

    querySnapshot.forEach((docSnap) => {
      foodItems.push({ id: docSnap.id, ...docSnap.data() });
    });

    return foodItems;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to update a food item
export const updateFoodItem = createAsyncThunk(
  'food/updateFoodItem',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const foodRef = doc(db, 'foodItems', id);
      await updateDoc(foodRef, updates);
      return { id, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch food items
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update food item
      .addCase(updateFoodItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateFoodItem.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const index = state.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      })
      .addCase(updateFoodItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default foodSlice.reducer;

