// Initialize Node App
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

/* Connect to DB */
mongoose.connect(
  "mongodb+srv://dbUser:wvZgFr4sjSPLKcF@cluster0.3tlyb.mongodb.net/todoDb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

/* Create Collection Schema */
const itemSchema = new mongoose.Schema({
  content: String,
});

const Item = mongoose.model("Item", itemSchema);

// Create Items

const item1 = new Item({
  content: "Welcome to your To Do List!",
});

const item2 = new Item({
  content: "Hit the + button to add a new item.",
});

const item3 = new Item({
  content: "<-- Hit this to strikeoff an item.",
});

const item4 = new Item({
  content: "Hit this to delete an item. -->",
});

const defaultItems = [item1, item2, item3, item4];

// Output
app.get("/", function (req, res) {
  const day = date.day;
  const year = date.year;

  Item.find(function (err, list) {
    if (err) {
      console.log(err);
    } else {
      if (list.length === 0) {
        Item.insertMany(defaultItems);
      }
      res.render(__dirname + "/views/list.ejs", { day, list, year });
    }
  });
});

// Post
app.post("/", function (req, res) {
  const content = req.body.item;
  if (content) {
    const item = new Item({ content });
    item.save();
  }
  // Send the response to the browser
  res.redirect("/");
});

// Delete
app.post("/delete", function (req, res) {
  const id = req.body.id;
  if (id) {
    Item.deleteOne({ _id: id }, function (err) {
      if (err) return handleError(err);
    });
  }
  // Send the response to the browser
  res.redirect("/");
});

//Mount Page
app.listen(3000, function () {
  console.log(" -- Server is running on localhost:3000 --");
});
