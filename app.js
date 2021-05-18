// Initialize Node App
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

const day = date.day;
const year = date.year;
const today = date.isoDate;

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

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

// Create Items
const item1 = new Item({
  content: "Welcome to your list for the selected day",
});
const item2 = new Item({
  content: "You can pick another day with the date picker",
});
const item3 = new Item({
  content: "Hit the + button to add a new item",
});
const item4 = new Item({
  content: "<-- Hit this to strikeoff an item",
});
const item5 = new Item({
  content: "Hit this to delete an item -->",
});

const defaultItems = [item1, item2, item3, item4, item5];

// Output
app.get("/", function (req, res) {
  const listName = today;
  let title = listName;
  if (listName === today) {
    title = "Today";
  }
  List.findOne({ name: listName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        list.save();
        res.redirect(listName);
      } else {
        res.render(__dirname + "/views/list.ejs", {
          day,
          listItems: foundList.items,
          year,
          selectedDate: listName,
          title,
        });
      }
    }
  });
});

// Custom Lists
app.get("/:customListName", function (req, res) {
  const listName = req.params.customListName;
  let title = listName;
  if (listName === today) {
    title = "Today";
  }
  List.findOne({ name: listName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        list.save();
        res.redirect(listName);
      } else {
        res.render(__dirname + "/views/list.ejs", {
          day,
          listItems: foundList.items,
          year,
          selectedDate: listName,
          title,
        });
      }
    }
  });
});

// Post
app.post("/", function (req, res) {
  const list = req.body.list;
  const item = new Item({ content: req.body.item });

  if (!list) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: list }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect(list);
    });
  }
});

// Delete
app.post("/delete", function (req, res) {
  const list = req.body.list;
  const id = req.body.id;

  List.findOneAndUpdate({ name: list }, { $pull: { items: {_id: id} } }, function (err) {
    if (err) return handleError(err);
  });

  res.redirect(list);
});

// Date Selector
app.post("/dateSelector", function (req, res) {
  const selectedDate = req.body.selectedDate;
  if (selectedDate) {
    console.log(selectedDate);
  }
  res.redirect(selectedDate);
});

//Mount Page
app.listen(process.env.PORT || 3000, function () {
  console.log(" -- Server is running on localhost:3000 --");
});
