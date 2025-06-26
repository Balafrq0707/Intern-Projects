import React from "react";
import AuthCreds from "./components/AuthCreds";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetCreds from "./components/SetCreds";
import { Provider } from 'react-redux';
import store from './components/App/store';
import Dashboard from './components/Dashboard';
import AddProducts from "./components/AddProducts";
import ManageProducts from "./components/ManageProducts";
import './App.css'


function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null; 
}

function App() {
  return (
    <div >
      <Provider store={store}>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<RedirectToLogin />} />
              <Route path="/login" element={<AuthCreds />} />
              <Route path="/register" element={<SetCreds />} />
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/addProduct" element={<AddProducts/>}/>
              <Route path="/manageProducts" element={<ManageProducts/>}/>

            </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
