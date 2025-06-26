import React, { useEffect, useState } from 'react';
import '../App.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    inventory: '',
  });
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:3001/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      alert(result.message);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setFormValues({
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price,
      inventory: product.inventory,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`http://localhost:3001/api/products/${editingProduct}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.message);
      } else {
        alert('Product updated successfully');
        setEditingProduct(null);
        setImage(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

const filteredProducts = products.filter((product) =>
  (product.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (product.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
);

  return (
    <div className="manage-products">
      <h2>Manage Products</h2>

      <input
        type="text"
        placeholder="Search by title or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id} style={{ marginBottom: '20px' }}>
            {editingProduct === product.id ? (
              <form onSubmit={handleUpdate}>
                <input name="title" value={formValues.title} onChange={handleInputChange} required />
                <label>Product Category</label>
                <select
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Headphones">Headphones</option>
                  <option value="Speakers">Speakers</option>
                  <option value="Graphics cards">Graphics Cards</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Gaming">Gaming</option>
                </select>
                <textarea name="description" value={formValues.description} onChange={handleInputChange} />
                <input name="price" type="number" value={formValues.price} onChange={handleInputChange} />
                <input name="inventory" type="number" value={formValues.inventory} onChange={handleInputChange} />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
              </form>
            ) : (
              <div>
                <strong>{product.title}</strong> - {product.category} - ₹{product.price}
                <div>
                  <button onClick={() => startEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
