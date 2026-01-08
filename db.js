const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('employee', 'admin')) NOT NULL DEFAULT 'employee'
    )`);

  // Leaves table
  db.run(`CREATE TABLE IF NOT EXISTS leaves (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        reason TEXT,
        status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
        admin_comment TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

  // Seed Admin User
  const adminEmail = "admin@company.com";
  const adminPassword = "adminpassword123";
  const adminName = "System Admin";

  db.get(
    "SELECT id FROM users WHERE email = ?",
    [adminEmail],
    async (err, row) => {
      if (err) {
        console.error("Error checking for admin user:", err.message);
        return;
      }

      if (!row) {
        try {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          db.run(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [adminName, adminEmail, hashedPassword, "admin"],
            (err) => {
              if (err) {
                console.error("Error seeding admin user:", err.message);
              } else {
                console.log("Admin user seeded successfully.");
              }
            }
          );
        } catch (hashError) {
          console.error("Error hashing admin password:", hashError.message);
        }
      } else {
        console.log("Admin user already exists.");
      }
    }
  );
});

module.exports = db;
