import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  getProducts,
  saveProductImages,
  writeProducts,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:productId/upload",
  multer().single("product"),
  async (req, res, next) => {
    try {
      const fileNameExtension = extname(req.file.originalname);
      console.log("file name is that ", fileNameExtension);
      const fileName = req.params.productId + fileNameExtension;

      await saveProductImages(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/products/${fileName}`;

      const products = await getProducts();
      const index = products.findIndex(
        (product) => product.productId === req.params.productId
      );

      if (index !== -1) {
        const oldProduct = products[index];
        //const newImg = {imageUrl:url}
        const updatedProduct = {
          ...oldProduct,
          imageUrl: url,
          updatedAt: new Date(),
        };
        products[index] = updatedProduct;

        await writeProducts(products);
      }
      res.send("file saved!");
    } catch (error) {}
  }
);

export default filesRouter;
