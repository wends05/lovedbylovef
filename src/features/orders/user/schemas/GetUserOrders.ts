import type z from "zod";
import { PaginationSchema } from "@/lib/schemas/PaginationSchema";

export const GetUserOrdersSchema = PaginationSchema;

export type GetUserOrdersInput = z.infer<typeof GetUserOrdersSchema>;
