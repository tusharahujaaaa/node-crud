const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Mock database (in-memory storage)
let items = [];
let idCounter = 1;

mongoose
  .connect("mongodb+srv://crud:Crud@cluster0.mxla6.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

// Create - Add a new item
app.post("/items", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  try {
    const newItem = new Item({ name });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error saving item" });
  }
});

// Read - Get all items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving items" });
  }
});

// Read - Get a specific item by ID
app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving item" });
  }
});

// Update - Update an item by ID
app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    item.name = name;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// Delete - Remove an item by ID
app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

      // await item.remove();  removed not supported by mongoose now
      // await item.deleteOne();
      await Item.findByIdAndDelete(id);
      
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
