import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

// 1. CREATE --> POST http://localhost:3001/products/ (+body)
// 2. READ --> GET http://localhost:3001/products/ (+ optional query params)
// 3. READ (single product) --> GET http://localhost:3001/products/:productId
// 4. UPDATE (single product) --> PUT http://localhost:3001/products/:productId (+ body)
// 5. DELETE (single product) --> DELETE http://localhost:3001/products/:productId

const productsRouter = express.Router();

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "products.json"
);

const getJSON = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath));
const writeJSON = (jsonPath, dataArray) =>
  fs.writeFileSync(jsonPath, JSON.stringify(dataArray));

productsRouter.post("/", (req, res) => {
  try {
    const newProduct = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    const productsArray = getJSON(productsJSONPath);
    productsArray.push(newProduct);
    writeJSON(productsJSONPath, productsArray);
    res.status(201).send({ id: newReview.id });
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/", (req, res) => {
  try {
    const productsArray = getJSON(productsJSONPath);
    res.status(200).send(productsArray);
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId", (req, res) => {
  try {
    const productsArray = getJSON(productsJSONPath);
    const product = productsArray.find(
      (product) => product.id === req.params.productId
    );
    res.send(product);
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId", (req, res) => {
  try {
    const productsArray = getJSON(productsJSONPath);
    const index = productsArray.findIndex(
      (product) => product.id === req.params.productId
    );
    const oldProduct = productsArray[index];
    const updatedProduct = {
      ...oldProduct,
      ...req.body,
      updatedAt: new Date(),
    };
    productsArray[index] = updatedProduct;
    writeJSON(productsJSONPath, productsArray);
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productId", (req, res) => {
  try {
    const productsArray = getJSON(productsJSONPath);
    const remainingProducts = productsArray.filter(
      (product) => product.id !== req.params.productId
    );
    writeJSON(productsJSONPath, remainingProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default productsRouter;
