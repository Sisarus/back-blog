const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

const saltRounds = 10

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of helper.initialUsers) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds)

    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash: passwordHash
    })

    await newUser.save()
  }
})

describe('when there is initially some users saved', () => {
  test('all Users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(helper.initialUsers.length)
  })
  describe('Missing or invalid data', () => {
    test('Cannot create user when username is too short', async () => {
      const newUser = new User({
        username: 'mo',
        name: 'Herra Rapu',
        password: 'money'
      })

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('Cannot create user when name is missing', async () => {
      const newUser = new User({
        username: 'money',
        name: '',
        password: 'money'
      })

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('Cannot create user when password is missing', async () => {
      const newUser = new User({
        username: 'money',
        name: 'Herra Rapu',
        password: ''
      })

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })

    test('Cannot create user when username is not unique', async () => {
      const newUser = new User(  {
        username: 'soitin',
        name: 'Jalmari Kalmari',
        password: 'soitin'
      })

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})