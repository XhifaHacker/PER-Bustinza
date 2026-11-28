const express = require('express');

const mysql = require("mysql2");
const app = express();
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/js", express.static(__dirname + "/js"));

const conexion = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT),
    database: process.env.MYSQLDATABASE,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/validar", function (req, res) {
  const { nombres, celular, correo, mensaje } = req.body;
  const registrar =
    "INSERT INTO info (nombre, telefono, correo, comentario) VALUES (?, ?, ?, ?)";

  conexion.execute(registrar, [nombres, celular, correo, mensaje], function (error) {
    if (error) {
      console.error("No se pudo guardar el formulario:", error.message);
      return res.status(500).send("No se pudo enviar el mensaje. Inténtalo nuevamente.");
    }

    return res.send(`
            <script>
                alert("Datos enviados correctamente");
                window.location.href="/";
            </script>
            `);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});