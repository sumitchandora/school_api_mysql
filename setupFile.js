const connectDB = require("./database/connection");

async function setup() {
  const db = await connectDB();
    console.log(db)
  // Create table
  await db.query(`
    CREATE TABLE schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    )
  `);
  console.log("Table 'schools' created");

  // Insert sample data
  await db.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    ["Delhi Public School", "RK Puram, Delhi", 28.5672, 77.2100]
  );

  await db.query(
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
    ["St. Xavier's High School", "Mumbai", 19.0760, 72.8777]
  );

  console.log("Sample schools inserted");

  // Fetch all schools
  const [rows] = await db.query("SELECT * FROM schools");
  console.log("Schools:", rows);

  await db.end();
}

setup();
