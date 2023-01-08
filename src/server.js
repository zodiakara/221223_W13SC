import express from "express";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import filesRouter from "./api/files/index.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";

const server = express();
const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

// ******** MIDDLEWARES

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());

// ******** ENDPOINTS

server.use("/products", productsRouter);
server.use("/products", filesRouter);
server.use("/products", reviewsRouter); ///:productId/reviews/:reviewId

// ******** ERROR HANDLERS

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
