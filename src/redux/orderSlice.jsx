import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { createSelector } from 'reselect';

// ✅ Thunk to place an order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ userId, userName, tableNumber, items }, { rejectWithValue }) => {
    try {
      const orderId = new Date().getTime().toString();

      const orderData = {
        userId,
        userName, // ✅ Store user's name
        tableNumber,
        items,
        createdAt: new Date().toISOString(),
        status: "placed", // ✅ Initial status
      };

      await setDoc(doc(db, "orders", orderId), orderData);

      return { id: orderId, ...orderData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Thunk to fetch user's orders
export const fetchOrdersByUser = createAsyncThunk(
  'order/fetchOrdersByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const orders = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: docSnap.id,
          ...data,
          // ⬇️ Keep `createdAt` as is (assumes stored as ISO string)
          createdAt: typeof data.createdAt === "string" ? data.createdAt : null,
        });
      });

      return orders;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    userOrders: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.successMessage = 'Order placed successfully!';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userOrders = [];
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectUserOrders = (state) => state.order.userOrders;

export const selectUserOrdersMemoized = createSelector(
  [selectUserOrders],
  (userOrders) => userOrders
);

export default orderSlice.reducer;



