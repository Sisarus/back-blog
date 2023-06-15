const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reduceLikes = (sum, blog) => {return sum + blog.likes}

  return blogs.reduce(reduceLikes , 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = (favoriteBlog, compareBlog) => {
    return (compareBlog.likes > favoriteBlog.likes) ? compareBlog : favoriteBlog
  }

  const mostfavorite = blogs.reduce(mostLikes, { likes:0 })

  const blog =  {
    title: mostfavorite.title,
    author: mostfavorite.author,
    likes: mostfavorite.likes
  }

  return blog
}

const mostBlogs = (blogs) => {
  const blogsAuthor = _.groupBy(blogs, 'author')
  const authorMostBlogs = _.maxBy(Object.keys(blogsAuthor), (author) => blogsAuthor[author].length)

  const blog =  {
    author: authorMostBlogs,
    blogs: blogsAuthor[authorMostBlogs].length
  }

  return blog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}