import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "../api/products/index.js";
import reviewsRouter from "../api/reviews/index.js";

const server = express();
const port = 3001;

server.use(express.json());

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is running on port ${port}`);
});
