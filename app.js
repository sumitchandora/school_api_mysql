const connectDB = require('./database/connection');
const express = require("express");
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: true}));

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isNumber = (v) => v !== "" && v !== null && !isNaN(Number(v));
const inRange = (n, min, max) => Number(n) >= min && Number(n) <= max;


// Example GET request ->  /listSchools?lat=14.076&lng=70.8777

app.get("/listSchools", async (req, res) => {
    try {
      const { lat, lng } = req.query;
  
      if (!isNumber(lat) || !inRange(lat, -90, 90))
        return res.status(400).json({ error: "lat must be a number between -90 and 90" });
      if (!isNumber(lng) || !inRange(lng, -180, 180))
        return res.status(400).json({ error: "lng must be a number between -180 and 180" });
  
      const userLat = Number(lat);
      const userLng = Number(lng);
  
      const db = await connectDB();
  
      const query = `
        SELECT
          id, name, address, latitude, longitude,
          (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(latitude))
          )) AS distance_km
        FROM schools
        ORDER BY distance_km ASC;
      `;
  
      const [rows] = await db.query(query, [userLat, userLng, userLat]);
      await db.end();
  
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post("/addSchool", async (req, res) => {
    try {
      const { id, name, address, latitude, longitude } = req.body;
  
      // Validate
      if (!isNonEmptyString(name) || !isNonEmptyString(address))
        return res.status(400).json({ error: "name and address are required strings" });
      if (!isNumber(latitude) || !inRange(latitude, -90, 90))
        return res.status(400).json({ error: "latitude must be a number between -90 and 90" });
      if (!isNumber(longitude) || !inRange(longitude, -180, 180))
        return res.status(400).json({ error: "longitude must be a number between -180 and 180" });
  
      const db = await connectDB();
      const [result] = await db.query(
        `INSERT INTO schools (id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
        [id, name, address, Number(latitude), Number(longitude)]
      );
      await db.end();
  
      return res.status(201).json({ message: "School inserted successfully", insertedId: result.insertId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.REMOTE_PORT || 1000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



