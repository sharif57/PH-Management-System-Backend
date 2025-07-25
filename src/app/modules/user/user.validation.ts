import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),

  email: z.string().email(),

  password: z.string().min(8),

  phone: z.string().optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .optional(),
});



export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" })
    .optional(),

  password: z.string().min(8).optional(),

  phone: z.string().optional(),

  address: z
    .string({ invalid_type_error: "Address must be string" })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDelete: z.boolean({invalid_type_error:'isDelete must be boolean'}).optional(),
  isVerified: z.boolean({invalid_type_error:'isVerified must be boolean'}).optional(),
});
