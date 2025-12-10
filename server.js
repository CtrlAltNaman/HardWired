const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Parser } = require("json2csv");

app.use(bodyParser.json());

// MongoDB Connection
const mongoose = require('mongoose');

// Direct MongoDB connection string (replace with your actual string)
const MONGO_URI = "mongodb+srv://HardWired:SIH@2024@cluster0.16amw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB using the connection string
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Schema and model for frequency data
const frequencySchema = new mongoose.Schema({
    frequency: Number,
    timestamp: { type: Date, default: Date.now }
});
const Frequency = mongoose.model("Frequency", frequencySchema);

// Receive data from ESP32
app.post("/data", async (req, res) => {
    const { frequency } = req.body;

    if (!frequency) {
        return res.status(400).send("Frequency value is required");
    }

    await Frequency.create({ frequency });
    res.send("Data stored");
});

// Send data to website
app.get("/get-data", async (req, res) => {
    const data = await Frequency.find().sort({ timestamp: 1 });
    res.json(data);
});

// Download data as CSV
app.get("/download-data", async (req, res) => {
    const data = await Frequency.find().sort({ timestamp: 1 });
    const json2csv = new Parser({ fields: ["frequency", "timestamp"] });
    const csv = json2csv.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    res.send(csv);
});

// Monitor inactivity
setInterval(async () => {
    const latest = await Frequency.findOne().sort({ timestamp: -1 });
    if (latest && (new Date() - latest.timestamp) / 1000 > 20) {
        console.log("No new data in 20 seconds. Clearing database.");
        await Frequency.deleteMany({});
    }
}, 10000);

app.listen(3000, () => console.log("Server running on port 3000"));
