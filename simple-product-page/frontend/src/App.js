  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import { useEffect, useState } from 'react';
  import NavBar from './components/NavBar';
  import ProductList from './components/products';
  import CartView from './components/Cart/CartView';
  import OrderSummary from './components/Cart/OrderSummary';
  import { CartProvider } from './components/Cart/CartContext';
  import AuthForm from './components/AuthForm';
  import Profile from './components/Profile';
  import CategoryPage from './components/CategoryPage'; 
  import ProductDetails from './components/ProductDetails';
  import './App.css';

  const backgroundImages = [
    'http://localhost:3001/images/bg1.jpg',
    'http://localhost:3001/images/bg2.jpg',
    'http://localhost:3001/images/bg3.jpg',
    'http://localhost:3001/images/bg4.jpg',
    'http://localhost:3001/images/bg5.jpg',
  ];

  function App() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return (
      <CartProvider>
        <div
          className="app-background"
          style={{ backgroundImage: `url(${backgroundImages[currentIndex]})` }}
        >
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/cart/summary" element={<OrderSummary />} />
              <Route path="/login" element={<AuthForm type="login" />} />
              <Route path="/register" element={<AuthForm type="register" />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductDetails />} />

            </Routes>
          </BrowserRouter>
        </div>
      </CartProvider>
    );
  }

  export default App;
