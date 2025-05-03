import { useEffect, useState } from 'react';

const EditContactForm = ({ entry, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    country: '',
    pincode: ''
  });
  const [originalName, setOriginalName] = useState('');


  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name ,
        email: entry.email,
        mobile: entry.mobile ,
        country: entry.country,
        pincode: entry.pincode
      });
      setOriginalName(entry.name); 
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/info/${originalName}`, {
        method: "PUT", 
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData) 
    })
    if (res.ok) {
        console.log("Updated Contact:", formData);
        alert("Contact Updated Successfully");

        onClose(); 
    } else {
        console.error("Failed to update contact");
      }
    } 


  return (
    <>
        <form className="edit-form" onSubmit={handleSubmit}>
            <h2>Edit Contact</h2>
            <div className="form-group">
                <label htmlFor='name'>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div className="form-group">
                <label htmlFor='mobile'>Mobile</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Phone" />
            </div>
            <div className="form-group">
                <label htmlFor='email'>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="form-group">
                <label htmlFor='country'>Country</label>
                <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            </div>
            <div className="form-group">
                <label htmlFor='pincode'>Pincode</label>
                <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
            </div>
            <button type="submit" className="form-button">Update</button>
        </form>
    </>
  );
};

export default EditContactForm;
