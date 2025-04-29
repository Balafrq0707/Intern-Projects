import React from 'react'

const ContactForm = ({handleSubmit, name, setName, mobile, setMobile, email, setMail, country, setCountry, pincode, setPincode}) => {
  return (
    <div className="container">
      <h1>Add a new contact</h1><br/>
      <form onSubmit={handleSubmit} className="info-form">

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
    </div>
  )
}

export default ContactForm