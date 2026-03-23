import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (
  _req: Request,
  res: Response
) => {
  return res.status(404).json({
    error: "Route not found",
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Unhandled error:", error);

  return res.status(500).json({
    error: "Internal server error",
  });
};