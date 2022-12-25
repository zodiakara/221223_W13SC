// error handler middlewares go here
// eh is a function

export const genericErrorHandler = (error, req, res, next) => {
  console.log(error); // it is very useful to console log the specific error,
  // cause the error messages are server generated - WE WRITE THEM
  res
    .status(500)
    .send({ message: "an error occured, we're gonna fix it asap" });
};
