import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Por favor, insira um email válido." }),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    confirmPassword: z
      .string()
      .min(6, { message: "A confirmação de senha é obrigatória." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type SignInDTO = z.infer<typeof signInSchema>;
export type SignUpDTO = z.infer<typeof signUpSchema>;
