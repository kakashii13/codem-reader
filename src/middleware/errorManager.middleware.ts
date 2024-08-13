import { NextFunction, Request, Response } from "express";
import { HttpException } from "../error/httpException";

export const errorManagerMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorCode = error.errorCode || 500;
  const errorMessage = error.message || "Internal server error";

  res.status(errorCode).send({
    message: errorMessage,
    status: errorCode,
  });
};
