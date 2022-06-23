const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const key = "123456"

const {
  getAll,
  getByEmailClave,
  deleteById,
  create,
  status,
  update,
} = require("../db/skaters")

router.get("/datos", async (req, res) => { // Ruta que muestra la lista de participantes
  try {
    const users = await getAll()
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.put("/:id", async (req, res) => { // Ruta para modificar un participante por id y estado
  try {
    const user = await status(req.params.id, req.params.estado)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/login", async (req, res) => { // Ruta para crear un participante
  try {
    const beforeUser = await getByEmailClave(req.body.email, req.body.clave)
    if (beforeUser) {
      res.status(400).send({
        error: "El email ya existe",
      })
    } else {
      const user = await create(req.body)
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 120,
          data: user,
        },
        key
      )
      res.send(`
    <a href="/views/datos?token=${token}"> <p> Ir a los datos </p> </a>
    Bienvenido, ${email}.
    <script>
    localStorage.setItem('token', JSON.stringify("${token}"))
    </script>
    `)
    }
    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.delete("/:id", async (req, res) => { // Ruta para eliminar un participante por id
  try {
    const user = await deleteById(req.params.id)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.put("/:id", async (req, res) => { // Ruta para actualizar un participante por id
  try {
    const user = await update(req.params.id, req.body)
    if (user) res.send(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
