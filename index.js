const express = require("express")
const expressFileUpload = require("express-fileupload")
const { engine } = require("express-handlebars")
const skateRouter = require("./src/db/skaters")
const app = express()
const { getAll, getEmailPass, deleteById, create, status, update } = require("./src/db/skaters")

const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("skaters", getEmailPass)
app.post("/skaters", create)
app.put("/skaters", update)
app.delete("/skaters", deleteById)

app.use("/", express.static(__dirname + "/public"))

app.use( // Límite en el peso de la foto a subir
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "El peso del archivo que intentas subir supera el límite permitido",
  })
)
app.engine( // Vistas
  "handlebars",
  engine({
    defaultLayout: "main",
    partialsDir: __dirname + "/views",
    layoutsDir: __dirname + "/views/mainLayout",
  })
)
app.set("view engine", "handlebars")

// Views
app.get("/", async (req, res) => {
  const data = await getAll()
  res.render("index") 
})

app.get("/registro", (req, res) => {
  res.render("registro")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/admin", (req, res) => {
  res.render("admin")
})

app.listen(PORT, () => {
  console.log("Server on")
})