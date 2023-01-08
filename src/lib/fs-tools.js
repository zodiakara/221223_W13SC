import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/products");

console.log("data folder path --->", dataFolderPath);

const productsJSONPath = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (products) =>
  writeJSON(productsJSONPath, products);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviews) => writeJSON(reviewsJSONPath, reviews);

export const saveProductImages = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);
