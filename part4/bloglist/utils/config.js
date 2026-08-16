require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = process.env.SECRET || 'Tara_fullstack_2026'

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}