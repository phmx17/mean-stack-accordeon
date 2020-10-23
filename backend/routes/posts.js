const express = require('express')
const multer = require('multer'); // tool to save images
const router = express.Router();

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');  // custom middleware to protect routes with jwt

// store incoming files with multer

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // handle undefined file extension
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('invalid mime type');
      if (isValid) {
        error = null; 
      }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-'); // replace spaces with dash
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext) // construct a unique file name
  }
})

// routes
router.post('', checkAuth, multer({storage}).single('image'), (req, res, next) => { // middleware chain here with protected route
  // construct url
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename // supplied by multer
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id        
      }
    });  
  });
});

router.put('/:id', checkAuth, multer({storage}).single('image'), (req, res, next) => {
  console.log(req.file)
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post)
  Post.updateOne({_id: req.params.id}, post).then((result) => {
    res.status(200).json({ message: 'Update successful' });  
  });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize;  // getting query params for pagination and convert to integer
  const currentPage = +req.query.page; // otherwise undefined
  const postQuery = Post.find();  // hijacking Post.find() from below
  let fetchedPosts; // in order to pass documents between .then() blocks below
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage -1)) // if on page 3 skip 2 pages
    .limit(pageSize);    
  } 

  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments();  // will pass posts and a count of all total
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count 
    });   
  });
});

// return a single post to keep post-create component updated
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;