// Initialize Node App
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let list = [];
let map = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// Output
app.get("/", function (req, res) {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const day = today.toLocaleString("en-US", options);
  const year = today.getFullYear();

  res.render(__dirname + "/views/list.ejs", {
    day,
    map,
    year
  });
});

// Post
app.post("/", function (req, res) {
  const item = req.body.item;
  if (item) {
    list.push(item);
  }
  map = list
    .map(
      (item) => `<div class="item">
  <input type="checkbox" />
  <p>${item}</p>
</div>`
    )
    .join("");
  // Send the response to the browser
  res.redirect("/");
});

//Mount Page
app.listen(3000, function () {
  console.log(" -- Server is running on port 3000 --");
});
