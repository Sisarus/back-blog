const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')

const saltRounds = 10

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const initialUsers = [
  {
    username: 'saippua',
    name: 'Paavo Pesusieni',
    password: 'saippua'
  },
  {
    username: 'soitin',
    name: 'Jalmari Kalmari',
    password: 'soitin'
  },
]

const nonExistingId = async () => {
  const note = new Blog({
    title: 'willremovethissoon',
    author: 'willremovethissoon',
    url: 'willremovethissoon'
  })
  await note.save()
  await Blog.deleteOne({ _id: note._id })

  return note._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createKanaUser = async () => {
  const passwordHash = await bcrypt.hash('kana', saltRounds)

  const newUser = new User({
    username: 'kana',
    name: 'kana',
    passwordHash: passwordHash
  })

  const savedUser = await newUser.save()

  return savedUser
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers, usersInDb, createKanaUser
}