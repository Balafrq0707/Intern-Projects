import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProductList from './components/products';
import CartView from './components/Cart/CartView';
import OrderSummary from './components/Cart/OrderSummary';
import { CartProvider } from './components/Cart/CartContext';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/cart/summary" element={<OrderSummary />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
