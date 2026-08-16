const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token || (
    request.get('authorization') && request.get('authorization').startsWith('Bearer ')
      ? request.get('authorization').replace('Bearer ', '')
      : null
  )

  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.SECRET)
      if (decodedToken.id) {
        request.user = await User.findById(decodedToken.id)
      }
    } catch (error) {
      // در صورت بروز خطا در اعتبارسنجی توکن، request.user همان undefined باقی می‌ماند
    }
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}