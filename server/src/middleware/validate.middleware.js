
import { ZodError } from "zod";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate the request body using the Zod schema
      const validatedData = schema.parse(req.body);

      // Replace the original body with the validated data
      req.body = validatedData;

      // Continue to the controller
      next();
    } catch (error) {
      // Check if the error came from Zod validation
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field:
            issue.path.length > 0
              ? issue.path.join(".")
              : "body",
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      // If this was not a Zod error,
      // pass it to the central error handler
      next(error);
    }
  };
};

export default validate;

