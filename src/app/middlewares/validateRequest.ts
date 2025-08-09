import {  RequestHandler } from "express";
import { AnyZodObject } from "zod";


export const validateRequest =
  (zodSchema: AnyZodObject): RequestHandler =>
  async (req, _ , next) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };