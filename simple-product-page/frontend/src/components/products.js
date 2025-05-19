import React, { useEffect, useState } from 'react';
import { useCart } from '../components/Cart/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { addToCart } = useCart();

  const token = localStorage.getItem('token');


  useEffect(() => {
    fetch('http://localhost:3001/api/products', {
      headers: {
         'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  },);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (

    <div className="product-list" id="products">
      <div>
         <h2>All Products</h2>
         <br/>
      </div>
      <div className="product-grid  ">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p><strong>${product.price}</strong></p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
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
