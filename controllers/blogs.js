const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  const blog = new Blog({
    title, author, url,
    likes: likes ? likes : 0
  })

  blog.user = user._id

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const newBlog = await Blog.findOne({ _id: savedBlog._id }).populate('user', { username: 1, name: 1, _id: 1 })

  response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const userid = request.user._id

  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === userid.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)

    // Remove blog_id from user
    const user = await User.findById(blog.user)
    user.blogs = await user.blogs.filter((b) => b.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('request.user', request.body)
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  console.log('here ', request.params.id)

  await Blog.findByIdAndUpdate(request.params.id, blog)
  response.status(202).end()
})


module.exports = blogsRouter