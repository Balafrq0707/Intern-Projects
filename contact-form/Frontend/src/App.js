import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setMail] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/info')
      .then(res => res.json())
      .then(data => {
        setInfoList(data); 
      })
      .catch(err => {
        console.log("Error fetching data:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInfo = { name, mobile, email, country, pincode };

    try {
      const res = await fetch('http://localhost:3001/info', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newInfo)
      });

      if (res.ok) {
        console.log('Data submitted successfully!', newInfo);

        setName('');
        setMobile('');
        setMail('');
        setCountry('');
        setPincode('');

        const updatedData = await fetch('http://localhost:3001/info')
          .then(res => res.json())
          .then(data => data)
          .catch(err => {
            console.log("Error fetching updated data:", err);
          });

        setInfoList(updatedData);
      }
    } catch (error) {
      console.log("Error submitting data", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="info-form">
        <h2>Submit Your Information</h2>

        <div className="form-group">
          <label htmlFor='name'>Name</label>
          <input
            type="text"
            value={name}
            required
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor='mobile'>Phone No:</label>
          <input
            type="text"
            value={mobile}
            required
            placeholder="Your Mobile Number"
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor='email'>Email ID</label>
          <input
            type="email"
            value={email}
            required
            placeholder="Email ID"
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor='country'>Country</label>
          <input
            type="text"
            value={country}
            required
            placeholder="Enter Your Country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor='pincode'>PinCode</label>
          <input
            type="text"
            value={pincode}
            required
            placeholder="Pincode"
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>

      <div className="submitted-info">
        <h2>Submitted Information</h2>
        {infoList.length > 0 ? (
          <ul className="info-list">
            {infoList.map((entry, index) => (
              <li key={index} className="info-item">
                <div className="info-details">
                  <strong>{entry.name}</strong>
                  <p>Phone: {entry.mobile}</p>
                  <p>Email: {entry.email}</p>
                </div>
                <button className="edit-button">Edit</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No information submitted yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
