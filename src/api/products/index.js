import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";
import { checkProductsSchema, triggerBadRequest } from "./productsValidator.js";

// 1. CREATE --> POST http://localhost:3001/products/ (+body)
// 2. READ --> GET http://localhost:3001/products/ (+ optional query params)
// 3. READ (single product) --> GET http://localhost:3001/products/:productId
// 4. UPDATE (single product) --> PUT http://localhost:3001/products/:productId (+ body)
// 5. DELETE (single product) --> DELETE http://localhost:3001/products/:productId

const { NotFound, BadRequest } = httpErrors;

const productsRouter = express.Router();

productsRouter.post(
  "/",
  checkProductsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId: uniqid(),
      };
      const productsArray = await getProducts();
      productsArray.push(newProduct);
      await writeProducts(productsArray);
      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    res.status(200).send(productsArray);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const product = productsArray.find(
      (product) => product.id === req.params.productId
    );

    if (product) {
      res.send(product);
    } else {
      next(NotFound(`Product with id ${req.params.productId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//edit a single product -> also copy this to filesRouter later!!
productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
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
    await writeProducts(productsArray);
    res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
});
productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();
    const remainingProducts = productsArray.filter(
      (product) => product.id !== req.params.productId
    );
    await writeProducts(remainingProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default productsRouter;
