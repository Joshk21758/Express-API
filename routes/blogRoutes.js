const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

//fetch posts route
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(100).json(posts);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch posts" });
  }
});

//create post route
router.post("/post/create", async (req, res) => {
  //extract form fields
  const { title, content } = req.body;
  //create new Post instance
  const post = new Post({
    title,
    content,
  });
  try {
    //save the post
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error saving the post", err });
  }
});

//fetch single post route
router.get("/post/show/:id", async (req, res) => {
  //find post by id
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Failed to find the post by id" });
    }
    res.json(post);
  } catch (err) {
    res.json({ message: "Could not find the post" });
  }
});

//Update the post route
router.put("/post/edit/:id", async (req, res) => {
  //find post by id and update
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return res.status(400).json({ message: "Cannot find and update post" });
    }
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err.message });
  }
});

//Delete post route
router.delete("/post/show/:id", async (req, res) => {
  //find post to delete
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(400).json({ message: "Cannot find and delete post" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
