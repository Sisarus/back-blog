const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reduceLikes = (sum, blog) => {return sum + blog.likes}

  return blogs.reduce(reduceLikes , 0)
}

const favoriteBlog = (blogs) = {
  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}