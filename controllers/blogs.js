const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    await blog.save()

    response.status(201).json(blog)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {

      response.status(400).json({ error: error.message })
    } else {

      response.status(500).json({ error: 'Something went wrong' })
    }
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})


module.exports = blogsRouter