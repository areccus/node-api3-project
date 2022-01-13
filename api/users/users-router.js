const express = require('express');
const User = require('./users-model')
const Post = require('../posts/posts-model')
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async(req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users =  await User.get()
    res.json(users)
  } catch(err) {
    next(err)
  }
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  try {
    res.json(req.user)
  } catch(err) {
    next(err)
  }
});
router.post('/', validateUser, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  try {
    const newUser = await User.insert({name: req.name})
    res.status(201).json(newUser)
  } catch(err) {
    next(err)
  }
});

router.put('/:id', validateUserId, validateUser, async(req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  const {id} = req.params
  try {
    const updateUser = await User.update(id, {name: req.name})
    const user = await User.getById(updateUser.id)
    res.json(user)
  } catch(err) {
    next(err)
  }
});

router.delete('/:id', validateUserId, async(req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try {
    const {id} = req.params
    const post = req.user
    // const deleteUser = 
    await User.remove(id)
    res.json(post)
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async(req, res,next) => {
  // RETURN THE ARRAY OF USER POSTS
  try {
    const {id} = req.params
    const posts = await User.getUserPosts(id)
    res.json(posts)
  } catch(err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  try {
    const {id} = req.params
    const post = await Post.insert({user_id: id, text: req.text})
    res.status(201).json(post)
  } catch(err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message
  })
})
// do not forget to export the router

module.exports = router