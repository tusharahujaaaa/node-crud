const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const PORT = 3001;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Mock database (in-memory storage)
let items = [];
let idCounter = 1;
// Create - Add a new item
app.post("/items", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  const newItem = { id: idCounter++, name };
  items.push(newItem);
  console.log(items);

  res.status(201).json(newItem);
});

// Read - Get all items
app.get("/items", (req, res) => {
  console.log(items);

  res.json(items);
});

// Read - Get a specific item by ID
app.get("/items/:id", (req, res) => {
  console.log(res);

  const { id } = req.params;
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});

// Update - Update an item by ID
app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const item = items.find((i) => i.id === parseInt(id));
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  item.name = name;
  res.json(item);
});

// Delete - Remove an item by ID
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex((i) => i.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  items.splice(itemIndex, 1);
  res.status(204).send(); // No content
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
