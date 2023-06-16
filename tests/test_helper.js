const Blog = require('../models/blog')

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


module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}