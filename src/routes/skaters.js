const express = require("express")
const path = require("path")
const router = express.Router()
const jwt = require("jsonwebtoken")

const { getAll, deleteById, create, statusEstado, update } = require("../db/skaters")

// Ruta que muestra la lista de participantes
router.get("/", async (req, res) => {
  try {
    const users = await getAll()
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para modificar un participante por id y estado
router.put("/estado/:id", async (req, res) => {
  try {
    const { estado } = req.body
    const { id } = req.params
    const user = await statusEstado(estado, id)
    if (user) res.json(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para crear a un participante
router.post("/", async (req, res) => {
	const { email, nombre, password, anos_experiencia, especialidad, estado } = req.body
	const { foto } = req.files
	const { name } = foto
  const ruta = path.join(`${__dirname}/public/img${name}`)
	foto.mv(ruta)
  try {
      const newUser = await create(email, nombre, password, anos_experiencia, especialidad, foto, estado)
      if (newUser) {
        res.status(201).json(newUser)
      } else {
        res.json({
          message: "Algo salió mal"
        })
      }
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para eliminar un participante por id
router.delete("/:id", async (req, res) => {
  try {
    const user = await deleteById(req.params.id)
    if (user) res.json(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para actualizar un participante por id
router.put("/:id", async (req, res) => {
  try {
    const { nombre, password, anos_experiencia, especialidad} = req.body
    const { id } = req.params
    const user = await update(nombre, password, anos_experiencia, especialidad, id)
    if (user) res.json(user)
    else res.sendStatus(404)
  } catch (error) {
    res.status(500).send(error)
  }
})

// Ruta para autorizar con el token
router.post("/:auth", async (req, res) => {
  const { email, password } = req.body
	const users = await getAll()
	const user = users.find((user) => user.email === email)
	if (user == null) {
		return res.status(400).send("usuario no encontrado")
	}
	try {
		if (password === user.password) {
			const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '10m',
			})
			res.send(`
<a href="/datos?token=${accessToken}"> <p> Ir al Dashboard </p> </a>
<a href="/admin?token=${accessToken}"> <p> Ir a pagina de administrador </p> </a>
Bienvenido, ${email}.
<script>
localStorage.setItem("token", JSON.stringify("${accessToken}"))
</script>
`)
		} else {
			res.send("No autorizado")
		}
	} catch (error) {
		console.log(error)
	}
})

// Ruta para generar el token
router.get("/:token", (req, res) => {
  const token = req.params.token
  jwt.verify(token, (error, decode) => {
    if (error) {
      res.status(403).json({
        message: "Token inválido",
      })
    } else {
      const data = {
        decode,
      }
      res.json(data)
    }
  })
})  

module.exports = router
