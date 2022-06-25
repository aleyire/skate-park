const express = require("express")
const path = require("path")
const router = express.Router()
const jwt = require("jsonwebtoken")
const key = "123456"

const { getAll, getEmailPass, deleteById, create, status, update } = require("../db/skaters")

// Ruta que muestra la lista de participantes
router.get("/skaters", async (req, res) => {
  try {
    const users = await getAll()
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para modificar un participante por id y estado
router.put("/:id", async (req, res) => {
  try {
    const user = await status(req.params.id, req.params.estado)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para que ingrese un participante
router.post("/", async (req, res) => {
  try {
    const beforeUser = await getEmailPass(req.body.email, req.body.password)
    if (beforeUser) {
      res.status(400).send({
          error: 'El usuario ya existe'
      })
    } else {
      const user = await create(req.body)
      res.send(user)
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para crear a los participantes
router.post("/registro", async (req, res) => {
  try {
  const user = await create(req.body)
  res.send(user)
  } catch (error) {
    res.status(500).send({
      error: `Algo salió mal... ${error}`,
      code: 500
  })
  }
})

// Ruta para eliminar un participante por id
router.delete("/:id", async (req, res) => {
  try {
    const user = await deleteById(req.params.id)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para actualizar un participante por id
router.put("/:id", async (req, res) => {
  try {
    const user = await update(req.params.id, req.body)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
