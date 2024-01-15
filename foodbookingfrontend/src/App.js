import { Navbar } from "./Components/Navbar/Navbar";
import { Route, Routes } from 'react-router-dom';

import { UserContextProvider } from "./UserContext";
import Home from "./Components/Home/Home";
import { LoginSignup } from "./Components/Signup/LoginSignup";
import { Signup } from "./Components/Signup/Signup";
import { Profile } from "./Components/Signup/Profile";
import ResturantSingle from "./Components/Resturants/ResturantSingle";
import NewRestaurant from "./Components/Resturants/NewRestaurant";
import Cart from "./Components/Cart/Cart";
import CartContextProvider from "./CartContext";
import Order from "./Components/Resturants/Order";
import Veg from "./Components/Home/Veg";
import NonVeg from "./Components/Home/NonVeg";
import Payments from "./Components/Cart/Payments";
import Successful from "./Components/Cart/Successful";
import Abort from "./Components/Cart/Abort";
import ForgotPassword from "./Components/Signup/ForgotPassword";


function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>
     <Navbar/>
     <Routes>
     <Route path="/" element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path='/signin' element={<LoginSignup/>}/>
    <Route path='/userSignup' element={<Signup/>}/>
    <Route path='/profile' element={<Profile/>}/>
    <Route path='resturant/:title' element={<ResturantSingle/>}/>
    <Route path='newResturant' element={<NewRestaurant/>}/>
    <Route path='/cart' element={<Cart/>}/>
    <Route path='/myOrders' element={<Order/>}/>

    <Route path='/veg' element={<Veg/>}/>
    <Route path='/nonVeg' element={<NonVeg/>}/>
    <Route path='/payments' element={<Payments/>}/>
    <Route path='/success' element={<Successful/>}/>
    <Route path='/cancel' element={<Abort/>}/>
<Route path='/forgotPassword' element={<ForgotPassword/>} />



     </Routes>
     </CartContextProvider>
    </UserContextProvider>
  );
}

export default App;
