import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name is a mandatory field and it needs to be a STRING",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage:
        "description is a mandatory field and it needs to be a STRING",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "brand is a mandatory field and it needs to be a STRING",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "price is a mandatory field and it needs to be a NUMBER",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category is a mandatory field and it needs to be a STRING",
    },
  },
};

export const checkProductsSchema = checkSchema(productsSchema);

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
