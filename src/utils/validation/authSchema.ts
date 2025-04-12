import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Неверный адрес электронной почты").nonempty("Электронная почта обязательна"),
  otp: z
    .union([z.number().int().positive(), z.undefined()])
    .optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyCode: z.string().optional(),
  companyName: z.string().optional(),
});

export type AuthFormValues = z.infer<typeof authSchema>;
