const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const savedUser = await helper.createKanaUser()

  for (const blog of helper.initialBlogs) {
    const newBlog = new Blog({
      title: blog.title,
      aurhor: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: savedUser._id
    })
    await newBlog.save()
  }
})

describe('when there is initially some blogs saved', () => {
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

  describe('POST adding new blogs', () => {
    test('Can add new blog', async () => {
      const savedUser = await User.findOne({ name: 'kana' })

      const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10,
        user: savedUser._id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      expect(titles).toContain(
        'First class tests'
      )

    })
  })

  describe('POST adding blogs with no-data', () => {
    test('If blog has no likes, zero should start value', async () => {
      const savedUser = await User.findOne({ name: 'kana' })

      const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martini',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        user: savedUser._id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const blog = blogsAtEnd[blogsAtEnd.length - 1]

      expect(blog.likes).toBe(0)
    })

    test('Bad request if no title', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('Bad request if no url', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('DELETE one blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const savedUser = await User.findOne({ name: 'kana' })

      const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart [0]

      console.log(blogToDelete.id)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('PUT new data one blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsStart = await helper.blogsInDb()
      const blogToUpdate = blogsStart[0]

      blogToUpdate.likes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(202)

      const blogsEnd = await helper.blogsInDb()
      const blogEnd = blogsEnd[0]
      expect(blogEnd.likes).toBe(blogToUpdate.likes)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})