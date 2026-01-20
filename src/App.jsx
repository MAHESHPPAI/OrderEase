import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from './components/ForgotPassword';
import Confirm from './components/Confirm';
import Home from './components/Home';
import PlacedOrders from './components/PlacedOrders';
import AdminDashboard from "./components/AdminDashboard";
import WaiterManagement from './components/WaiterManagement';
import OrderManagement from "./components/OrderManagement";
import MenuManagement from "./components/MenuManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/profile" element={<PlacedOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/waiters" element={<WaiterManagement />}></Route>
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/menu" element={<MenuManagement />} />

        
      </Routes>
    </Router>
  );
}

export default App;

