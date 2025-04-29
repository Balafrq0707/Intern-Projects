  import { useState, useEffect } from "react";
  import './App.css';
  import ContactForm from "./components/ContactForm";
  import ContactList from "./components/ContactList"; 
  function App() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setMail] = useState('');
    const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [infoList, setInfoList] = useState([]);
    const [clickEvent, setClickEvent] = useState("");

    useEffect(() => {
      if (clickEvent === "list") {
        fetch('http://localhost:3001/info')
          .then(res => res.json())
          .then(data => setInfoList(data))
          .catch(err => console.log("Error fetching data:", err));
      }
    }, [clickEvent]);
    
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
      <div className="button-group">
        <button onClick={()=>setClickEvent("list")}>Contact List</button>
        <button onClick={()=>setClickEvent("form")}>Add Contact</button>

        {clickEvent === "list" && <ContactList infoList={infoList}  />}
        {clickEvent ==="form" && <ContactForm handleSubmit={handleSubmit} name={name} setName={setName} mobile={mobile} setMobile={setMobile} email={email} setMail={setMail} country={country} setCountry={setCountry} pincode={pincode} setPincode={setPincode}/>}


      </div>
    );
  }

  export default App;
