require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const mongoDBenv = process.env.DATABASE_URL;

const Model = require("./model/model");

mongoose.connect(mongoDBenv);
const database = mongoose.connection;

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Conectado a mongoDB");
});

let respuesta = {
  error: false,
  codigo: 200,
  mensaje: "",
};

app.get("/", function (req, res) {
  respuesta = {
    error: false,
    codigo: 200,
    mensaje: "Servidor Activo",
  };
  res.send(respuesta);
});

app.get("/products", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/products", async (req, res) => {
  const data = new Model({
    id: req.body.id,
    name: req.body.name,
    sizes: req.body.sizes,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    imageSrc: req.body.imageSrc,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const data = await Model.findByIdAndDelete(id)
      res.send(`El producto ${data.name} fue borrado con exito`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});
