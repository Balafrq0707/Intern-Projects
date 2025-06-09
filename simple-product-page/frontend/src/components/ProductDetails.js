import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StarRating from '../components/StarRatings';
import { useCart } from '../components/Cart/CartContext';
import '../App.css';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(null); 
  const session = useSelector((state) => state.session.session); 
  const userId = session?.id; 
  const token = localStorage.getItem('token'); 
  const { addToCart, cart } = useCart();
  

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setUserRating(data.userRating || null);
      })
      .catch(err => console.error('Failed to fetch product:', err));
  }, [productId, token]);

   const handleAddToCart = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  const handleRate = (value) => {
    if (!userId) {
      alert('You cannot post reviews on guest version!');
      return;
    }

    fetch(`http://localhost:3001/api/products/${productId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rating: value, userId })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to submit rating');
        return res.json();
      })
      .then(updatedProduct => {
        setProduct(updatedProduct);
        setUserRating(updatedProduct.userRating || value); // ✅ Fall back to local value
      })
      .catch(err => {
        console.error('Rating failed:', err);
      });
  };

  if (!product) return <div className="product-details">Loading...</div>;

  return (
    <div className='product-wrapper'>
    <div className="product-details">
      <div className="image-section">
        <img
          src={
            product.image?.startsWith('http')
              ? product.image
              : `http://localhost:3001/images/${product.image}`
          }
          alt={product.title}
        />
      </div>

      <div className="info-section">
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        <p><strong>Available:</strong> {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}</p>
        <p>{product.description}</p>

        {/* ⭐ Star Rating Section */}
        <div>
          <StarRating
            rating={userRating ?? product.rating}
            numRatings={product.numRatings}
            onRate={handleRate}
          />
          <p style={{ fontSize: '14px', marginTop: '4px' }}>
            {(userRating ?? product.rating).toFixed(1)} ({product.numRatings} ratings)
          </p>
        </div>

        <div className="buttons">
          <button disabled={product.inventory === 0} onClick={(e) => handleAddToCart(product, e)}>Add to Cart</button>
          <button disabled={product.inventory === 0}>Buy Now</button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductDetails;
