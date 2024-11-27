const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());

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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirm_password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

app.post("/users", async (req, res) => {
  const user = req.body;

  if (!user.name) {
    return res.status(400).json({ error: "User name are required" });
  } else if (!user.email) {
    return res.status(400).json({ error: "User email are required" });
  } else if (!user.number) {
    return res.status(400).json({ error: "User number are required" });
  } else if (!user.password) {
    return res.status(400).json({ error: "User password are required" });
  } else if (!user.confirm_password) {
    return res
      .status(400)
      .json({ error: "User confirm_password are required" });
  } else if (!user) {
    return res.status(400).json({ error: "All details are required" });
  } else if (user.password != user.confirm_password) {
    return res
      .status(400)
      .json({ error: "password and confirm password must match" });
  }

  try {
    const newItem = new User(user);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Error saving item" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error fetching item" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await User.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    await item.deleteOne();
    res.status(204).send("deleted Successfully");
  } catch {
    res.status(500).json({ error: "Error deleting data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
