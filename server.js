const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

// Function to read CSV and return data
function readCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// GET /api/data?location=New York&item=Gears
app.get("/api/data", async (req, res) => {
  try {
    const filters = req.query; // capture all query parameters
    const data = await readCSVFile("supply_chain_data.csv");

    // Apply filters dynamically
    const filteredData = data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        return row[key] && row[key].toLowerCase() === value.toLowerCase();
      });
    });

    res.json(filteredData);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to load CSV data", detail: err.message });
  }
});

// Start HTTPS server
app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://0.0.0.0:${PORT}`);
});
