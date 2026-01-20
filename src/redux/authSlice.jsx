import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import emailjs from 'emailjs-com';

export const loginUser  = createAsyncThunk(
  'auth/loginUser ',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) throw new Error('User  document not found.');
      const data = userDoc.data();

      if (!data.verified) throw new Error('Account not verified. Please check your email.');

      // Remove the role check for 'user' only
      // Instead, return the user data regardless of the role
      return { uid: user.uid, ...data, createdAt: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : null };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

   

export const signupUser  = createAsyncThunk(
  'auth/signupUser ',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'user',
        tableNumber: null,
        verified: false,
        // Store createdAt as a string
        createdAt: serverTimestamp(), // This will be a Firestore Timestamp
      });

      const confirmLink = `http://localhost:5173/confirm?uid=${user.uid}`;
      const templateParams = { to_email: email, to_name: name, confirm_link: confirmLink };

      await emailjs.send('service_etd6ekm', 'template_502hf27', templateParams, 'KOrXVP1_1wlF7hQxt');

      return { uid: user.uid, name, email };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout thunk
export const logoutUser  = createAsyncThunk(
  'auth/logoutUser ',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { uid } = getState().auth.user || {};
      if (uid) {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { tableNumber: null });
      }
      await signOut(auth);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser .pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser .fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = `Welcome back, ${action.payload.name}!`;
      })
      .addCase(loginUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup
      .addCase(signupUser .pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signupUser .fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Signup successful! Please check your email.';
      })
      .addCase(signupUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser .pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser .fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(logoutUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

