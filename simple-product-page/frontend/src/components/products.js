import React, { useEffect, useState } from 'react';
import { useCart } from '../components/Cart/CartContext';
import StarRating from '../components/StarRatings';
import { useSelector } from 'react-redux';

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [userRatings, setUserRatings] = useState({});

  const { addToCart, cart } = useCart();
  const token = localStorage.getItem('token');

  const session = useSelector((state) => state.session.session);
  const userId = session?.id;

  useEffect(() => {
    const url = category
      ? `http://localhost:3001/api/products/category/${encodeURIComponent(category)}`
      : 'http://localhost:3001/api/products';

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error ${res.status}: ${errorText}`);
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON. Raw response:', text);
          throw new Error('Response is not valid JSON');
        }
      })
      .then((data) => {
        setProducts(data);
        setCurrentPage(1);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, [category, token]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  const handleRating = (productId, ratingValue) => {
    if (!userId) {
      alert('You cannot post reviews on guest version!');
      return;
    }

    setUserRatings((prev) => ({ ...prev, [productId]: ratingValue }));

    fetch(`http://localhost:3001/api/products/${productId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rating: ratingValue, userId })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Rating failed with status ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((updatedProduct) => {
        setProducts((prev) =>
          prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
        );
        setUserRatings((prev) => ({
          ...prev,
          [productId]: updatedProduct.userRating || ratingValue
        }));
      })
      .catch((err) => {
        console.error('Rating failed:', err);
        setUserRatings((prev) => {
          const copy = { ...prev };
          delete copy[productId];
          return copy;
        });
      });
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="product-list" id="products">
      <div>
        <h3 className="category-head" style={{color: 'white'}}>{category ? `${category}` : 'All Products'}</h3>
        <br />
      </div>

      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const cartItem = cart.find((item) => item.id === product.id);
            const currentQuantity = cartItem ? cartItem.quantity : 0;
            const availableQuantity = product.inventory - currentQuantity;

            const displayRating = userRatings[product.id] ?? product.rating ?? 0;
            const ratingCount = product.numRatings ?? 0;

            return (
              <a
                href={`/product/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card-link"
                key={product.id}
                onClick={(e) => {
                  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="product-card">
                  {product.image && (
                    <img
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : `http://localhost:3001/images/${product.image}`
                      }
                      alt={product.title}
                      className="product-image"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        border: '1px solid whitesmoke'
                      }}
                    />
                  )}
                  <h3>{product.title}</h3>
                  <div>
                    <StarRating
                      rating={displayRating}
                      numRatings={ratingCount}
                      onRate={(value) => handleRating(product.id, value)}
                    />
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#555' }}>
                      {displayRating.toFixed(1)} ({ratingCount} ratings)
                    </p>
                  </div>
                  {/* <p>{product.description}</p> */}
                  <p>
                    <strong>${product.price}</strong>
                  </p>

                  {product.inventory === 0 ? (
                    <p style={{ color: '#b86818' }}>Out of Stock</p>
                  ) : availableQuantity > 0 ? (
                    <button onClick={(e) => handleAddToCart(product, e)}>Add to Cart</button>
                  ) : (
                    <p style={{ color: '#b86818' }}>
                      Only {availableQuantity} item{availableQuantity !== 1 ? 's' : ''} left
                    </p>
                  )}
                </div>
              </a>
            );
          })
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active' : ''}
              >
                {page}
              </button>
            );
          })}
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
