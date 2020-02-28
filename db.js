const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect(process.env.mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

module.exports = {
  db: mongoose.connection,
  post: Post,
  user: User,
  comment: Comment
};
