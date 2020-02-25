const express = require("express");
const path = require("path");
const db = require("diskdb");

db.connect("db", ["users", "posts", "comments"]);

const app = express();

const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", express.static("public"));

const root = path.join(__dirname, "public");

app.get("/posts", (req, res) => {
  res.sendFile(root + "/posts/list.html");
});

app.get("/posts/add", (req, res) => {
  res.sendFile(root + "/posts/add.html");
});

app.get("/api/v1/users", (req, res) => {
  let users = db.users.find();
  res.json(users);
  res.end();
});

app.get("/api/v1/posts", (req, res) => {
  let posts = db.posts.find();
  res.json(posts);
});

app.post("/api/v1/posts", (req, res) => {
  let newPost = req.body;
  db.posts.save(newPost);
  res.redirect("/posts");
});

app.delete("/api/v1/posts/:id", (req, res) => {
  let id = req.params.id;
  let removed = db.posts.remove({ _id: id }, false);
  if (id) {
    res.json("Item removed.");
  } else {
    res.json("Error. Couldn't remove item.");
  }
});

app.get("/api/v1/comments", (req, res) => {
  let comments = db.comments.find();
  res.json(comments);
});

app.get("*", (req, res) => res.send("Hello!"));

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
