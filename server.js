require("dotenv").load();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

if (!db) {
  console.log("Error connection DB");
} else {
  console.log("DB connected successfully");
}

const Post = mongoose.model("Post", {
  title: String,
  content: String,
  user: String,
  date: Date
});
const User = mongoose.model("User", { name: String, email: String });
const Comment = mongoose.model("Comment", {
  content: String,
  user: String,
  post: String,
  date: Date
});

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
  User.find({}, (err, data) => {
    if (!err) res.json(data);
    res.end(500, err);
  });
});

app.get("/api/v1/posts", (req, res) => {
  Post.find({}, (err, data) => {
    if (!err) res.json(data);
    res.end(500, err);
  });
});

app.post("/api/v1/posts", (req, res) => {
  let newPost = new Post(req.body);
  newPost.save((err, data) => {
    if (!err) res.redirect(`/posts/`);
    res.end(500, err);
  });
});

app.delete("/api/v1/posts/:id", (req, res) => {
  let id = req.params.id;
  Post.findOneAndDelete({ _id: id }, (err, data) => {
    if (!err) res.json(data);
    res.end(500, err);
  });
});

app.get("/api/v1/comments", (req, res) => {
  Comment.find({}, (err, data) => {
    if (!err) res.json(data);
    res.end(500, err);
  });
});

app.get("*", (req, res) => res.send("Hello world!"));

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
