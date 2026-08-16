const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const api = supertest(app)

let token = ''

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/birds_of_prey.info.html',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
  
  token = loginResponse.body.token

  const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json and correct amount (4.8)', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id (4.9)', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.strictEqual(Boolean(blog.id), true)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added with token (4.10 & 4.19)', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08x/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert.strictEqual(titles.includes('Canonical string reduction'), true)
  })

  test('if likes property is missing, it defaults to 0 (4.11)', async () => {
    const newBlog = {
      title: 'Blog without likes property',
      author: 'Test Author',
      url: 'http://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('backend responds with 400 bad request if title or url is missing (4.12)', async () => {
    const blogWithoutTitle = {
      author: 'Test Author',
      url: 'http://example.com/no-title',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)

    const blogWithoutUrl = {
      title: 'Blog without url',
      author: 'Test Author',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
  })

  test('fails with status code 401 if token is not provided (4.23)', async () => {
    const newBlog = {
      title: 'Unauthorized blog post',
      author: 'No One',
      url: 'http://example.com/unauthorized',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('deletion of a blog (4.13)', () => {
  test('succeeds with status code 204 if id is valid and owner deletes it', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert.strictEqual(titles.includes(blogToDelete.title), false)
  })
})

describe('updating a blog (4.14)', () => {
  test('succeeds with status code 200 if data is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })
})

after(async () => {
  await mongoose.connection.close()
})