const express = require("express")
const expressFileUpload = require("express-fileupload")
const { engine } = require("express-handlebars")
const skateRouter = require("./src/routes/skaters")
const app = express()

app.listen(3000, () => {
  console.log("Server on")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/skaters", skateRouter)

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

app.get("/", (req, res) => {
  res.render("index") // renderiza la vista index
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
