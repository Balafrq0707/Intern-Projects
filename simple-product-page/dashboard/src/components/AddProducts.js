import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

const AddProducts = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [inventory, setInventory] = useState('');
  const [isAdmin, setIsAdmin] = useState(null); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Token decoding failed:', err);
      setIsAdmin(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('price', price);
    formData.append('inventory', inventory);

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert('Product Created!');

      setTitle('');
      setCategory('');
      setDescription('');
      setPrice('');
      setImage(null);
      setInventory('');
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Something went wrong. Try again.');
    }
  };

  if (isAdmin === null) return <p>Loading...</p>;

  if (!isAdmin) return <p style={{ color: 'red' }}>Access denied. Admins only.</p>;

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div>
          <label>Title</label>
          <input
            value={title}
            type="text"
            placeholder="Enter the Product Title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Product Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Smartphones">Smartphones</option>
            <option value="Headphones">Headphones</option>
            <option value="Speakers">Speakers</option>
            <option value="Graphics cards">Graphics Cards</option>
            <option value="Laptops">Laptops</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            placeholder="Enter the Short Description"
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Choose an image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div>
          <label>Inventory</label>
          <input
            type="number"
            value={inventory}
            required
            onChange={(e) => setInventory(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
