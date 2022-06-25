const express = require("express")
const expressFileUpload = require("express-fileupload")
const { engine } = require("express-handlebars")
const skaterRouter = require("./src/routes/skaters")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/skaters", skaterRouter)

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