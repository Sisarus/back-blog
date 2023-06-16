const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs are identify as id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body

  blogs.forEach(blog => {
    expect(blog.id).toBeDefined()
  })

  blogs.forEach(blog => {
    expect(blog.__id).toBe(undefined)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})