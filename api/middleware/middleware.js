const e = require('express')
const User = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  const method = req.method
  const url = req.originalUrl
  const timestamp = new Date().toLocaleString()
  console.log(`[${timestamp}] ${method} to ${url}`)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const {id} = req.params
    const user = await User.getById(id)
    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
    } else {
      req.user = user
      next()
    }
  }catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const {name} = req.body
  if (!name) {
    res.status(400).json({
      message: 'missing required name field'
    })
  } else {
    req.name = name
    next()
  }

}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  
  const {text} = req.body
  if (!text) {
    res.status(400).json({
      message: 'missing required text field'
    })
  } else {
    req.text = text
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
logger,
validateUserId,
validateUser,
validatePost,
}