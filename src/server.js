import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import { genericErrorHandler } from "./errorHandlers.js";

const server = express();
const port = 3001;

server.use(express.json());

// ******** ENDPOINTS

server.use("/products", productsRouter);
server.use("/products/productId/reviews", reviewsRouter);

// ******** ERROR HANDLERS

server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
