const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

const connectDB = async () => {
  db = await open({
    filename: "./movies.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_input TEXT NOT NULL,
      recommended_movies TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("SQLite database connected");
};

const getDB = () => db;

module.exports = {
  connectDB,
  getDB,
};