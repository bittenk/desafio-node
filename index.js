

const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
const uuid = require('uuid')

const users = []

const checkUserId = (request, response, next) => {
  const { id } = request.params

  const index = users.findIndex(user => user.id === id)
  if (index < 0) {
    return response.status(404).json({ error: " there is no registered user !" })
  }
  request.userIndex = index
  request.userId = id

  next()
}

const moduleUrl = (request, response, next) => {
  const method = request.method

  const url = request.url

  console.log(`method: ${method} url: ${url}`)

  next()
}


app.get('/users', (request, response) => {
  return response.json(users)
})

app.post('/users', (request, response) => {
  const { clientName, price, order, status } = request.body
  const user = { id: uuid.v4(), clientName, price, order, status }

  users.push(user)

  return response.status(201).json(users)
})

app.put('/users/:id', checkUserId, moduleUrl, (request, response) => {
  const { clientName, price, order, status } = request.body
  const index = request.userIndex
  const id = request.userId
  const updataUser = { id, clientName, price, order, status }

  users[index] = updataUser
  return response.json(updataUser)
})

app.delete('/users/:id', checkUserId, moduleUrl, (request, response) => {
  const index = request.userIndex
  users.splice(index, 1)

  return response.status(201).json({ message: 'The user has been successfully deleted!' })
})

app.get('/users/:id', checkUserId, moduleUrl, (request, response) => {
  const index = request.userIndex
  return response.json(users[index])
})

app.patch('/users/:id', checkUserId, moduleUrl, (request, response) => {
  const index = request.userIndex
  users[index].status = 'pronto'

  return response.json(users[index])
})




app.listen(port, () => {
  console.log('😜🚀Server Starged on port ${port}')
})