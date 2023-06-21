const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username needed'],
    unique: [3, 'Username must be unique'],
    minlength: [3, 'Username minlength 3char']
  },
  name: {
    type: String,
    required: [true, 'Name needed']
  },
  passwordHash:  {
    type: String,
    required: [true, 'Password needed']
  },
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User