const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

app.use(cors()); 
app.use(bodyParser.json()); 
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.get('/info', (req, res) => {
    res.json(db.info);
});

app.post('/info', (req, res) => {
    const newInfo = req.body;
    db.info.push(newInfo); 

   
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        console.log("Data saved successfully");
        res.status(201).json(newInfo);
    });
});

app.put('/info/:name', (req,res)=>{
  const { name } = req.params;
  const updatedInfo = req.body; 
  const index = db.info.findIndex(item => item.name === name);

  if (index !== -1) {
      db.info[index] = { ...db.info[index], ...updatedInfo };

      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
          if (err) {
              console.error("Error writing to file:", err);
              return res.status(500).json({ error: 'Failed to update data' });
          }
          console.log("Data updated successfully");
          res.status(200).json(db.info[index]);
      });
  } else {

      res.status(404).json({ error: `Entry with name '${name}' not found` });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
