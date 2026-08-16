const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  
  const authorCounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let topAuthor = null
  let maxBlogs = 0

  for (const [author, count] of Object.entries(authorCounts)) {
    if (count > maxBlogs) {
      maxBlogs = count
      topAuthor = author
    }
  }

  return { author: topAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  let topAuthor = null
  let maxLikes = -1

  for (const [author, likes] of Object.entries(authorLikes)) {
    if (likes > maxLikes) {
      maxLikes = likes
      topAuthor = author
    }
  }

  return { author: topAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}