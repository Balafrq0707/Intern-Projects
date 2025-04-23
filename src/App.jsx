import { useEffect, useState } from "react"; 

function App(){
  const [name, setName]= useState('');
  const [mobile, setMobile] = useState('');
  const [email, setMail] = useState('');
  const [country, setCountry] = useState(''); 
  const [pincode, setPincode] = useState(''); 

  useEffect(() => {
    fetch('http://localhost:3001/info?_sort=id&_limit=1')
      .then(res => res.json())
      .then(data => {
          const fill = data[0];
          setName(fill.name);
          setMobile(fill.mobile);
          setMail(fill.email);
          setCountry(fill.country);
          setPincode(fill.pincode);
        
      })
      .catch(err => console.error('Failed to fetch:', err));
  }, []);



  const handleSubmit= async (e) =>{
    e.preventDefault()
    const newInfo = {name, mobile, email, country, pincode}

    try{
      const res = await fetch('http://localhost:3001/info', {
        method: 'POST',
        body: JSON.stringify(newInfo)
      })
      if(res.ok){
        console.log({name, mobile, email, country, pincode})  
      }  
    }
    catch(error){
      console.error('Error:', error);
    }
  }


  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type = "text"
        value = {name}
        required
        placeholder="Enter your name"
        onChange = {(e)=>setName(e.target.value)}
        />
        <br/>

        <label htmlFor='mobile'>Phone No:</label>
        <input type = "text"
        value = {mobile}
        required
        placeholder="Your Mobile Number"
        onChange={(e)=>setMobile(e.target.value)}/><br/>
       
        <label htmlFor='email'>Email ID</label>
        <input type = "email  "
        value = {email}
        required
        placeholder="Email ID"
        onChange={(e)=>setMail(e.target.value)}
        /><br/>

        <label htmlFor='country'>Country</label>
        <input type = "text"
        value = {country}
        required
        placeholder="Enter Your Country"
        onChange={(e)=>setCountry(e.target.value)}
        /><br/>
        
        <label htmlFor = 'pincode'>PinCode</label>
        <input type ="text"
        value = {pincode}
        required
        placeholder="Pincode"
        onChange={(e)=>setPincode(e.target.value)}
        /><br/>

        <button type="submit"> Submit</button>
      </form>

    </div>
  )
}


export default App;