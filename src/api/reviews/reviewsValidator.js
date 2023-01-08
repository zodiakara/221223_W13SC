import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const reviewsSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "comment is a mandatory field and it needs to be a STRING!",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage:
        "rate is a mandatory field and it needs to be a NUMBER between 1-5!",
    },
  },
};

export const checkReviewsSchema = checkSchema(reviewsSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "error during validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
