import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import {
  triggerBadRequest,
  checkReviewsSchema,
} from "../reviews/reviewsValidator.js";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const { NotFound, BadRequest } = httpErrors;

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/:productId/reviews",
  checkReviewsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews();
      const productId = req.params.productId;

      const newReview = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: productId,
        reviewId: uniqid(),
      };
      reviewsArray.push(newReview);
      await writeReviews(reviewsArray);
      res.status(201).send({ id: newReview.id });
      console.log(`new review to product ${req.params.product} added!`);
    } catch (error) {
      next(error);
    }
  }
);

// get all the reviews for a specific product
reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();
    const currentProductReviews = reviewsArray.filter(
      (review) => review.product === req.params.productId
    );
    res.status(200).send(currentProductReviews);
  } catch (error) {
    next(error);
  }
});

// get a single review for a specific product
reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();
    const review = reviewsArray.find(
      (review) => review.reviewId === req.params.reviewId
    );
    console.log(review);
    res.send(review);
  } catch (error) {
    next(error);
  }
});

// edit a single review for a specific product
reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviewsArray = await getReviews();
    const index = reviewsArray.findIndex(
      (review) => review.reviewId === req.params.reviewId
    );
    const oldReview = reviewsArray[index];
    const updatedReview = { ...oldReview, ...req.body, updatedAt: new Date() };
    reviewsArray[index] = updatedReview;
    await writeReviews(reviewsArray);
    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

// delete a single review for a specific product
reviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const reviewsArray = await getReviews();
      const remainingReviews = reviewsArray.filter(
        (review) => review.reviewId !== req.params.reviewId
      );
      await writeReviews(remainingReviews);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
