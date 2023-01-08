import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import uniqid from "uniqid";

const reviewsRouter = express.Router();

//const reviewsJSONPath = import.meta.url;  -- >this is the current file, that needs to be converted to the path
//const reviewsJSONPath = fileURLToPath(import.meta.url); // -- > now its converted to path

// now we need to import the directory path & join it with reviews.json file
const reviewsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "reviews.json"
); // -- > now its converted to path

console.log("reviews path --->", reviewsJSONPath);

const getJSON = (jsonPath) => JSON.parse(fs.readFileSync(jsonPath));
const writeJSON = (jsonPath, dataArray) =>
  fs.writeFileSync(jsonPath, JSON.stringify(dataArray));

reviewsRouter.post("/", (req, res) => {
  try {
    const newReview = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    const reviewsArray = getJSON(reviewsJSONPath);
    reviewsArray.push(newReview);
    writeJSON(reviewsJSONPath, reviewsArray);
    res.status(201).send({ id: newReview.id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", (req, res) => {
  try {
    const reviewsArray = getJSON(reviewsJSONPath);
    res.status(200).send(reviewsArray);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", (req, res) => {
  try {
    const reviewsArray = getJSON(reviewsJSONPath);
    const review = reviewsArray.find(
      (review) => review.id === req.params.reviewId
    );
    res.send(review);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", (req, res) => {
  try {
    const reviewsArray = getJSON(reviewsJSONPath);
    const index = reviewsArray.findIndex(
      (review) => review.id === req.params.reviewId
    );
    const oldReview = reviewsArray[index];
    const updatedReview = { ...oldReview, ...req.body, updatedAt: new Date() };
    reviewsArray[index] = updatedReview;
    writeJSON(reviewsJSONPath, reviewsArray);
    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", (req, res) => {
  try {
    const reviewsArray = getJSON(reviewsJSONPath);
    const remainingReviews = reviewsArray.filter(
      (review) => review.id !== req.params.reviewId
    );
    writeJSON(reviewsJSONPath, remainingReviews);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
