"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signUpSchema } from "@/resources/user/user.schemas";
import { signUp } from "@/resources/user/user.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function Registrar() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    try {
      await signUp(values);
      toast.success("Conta criada com sucesso!");

      router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#549d8c] to-[#2e6669] items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-white">
          <h2 className="text-4xl font-bold">
            Comece sua jornada de investimentos
          </h2>
          <p className="text-lg text-white/90">
            Consolide todos os seus investimentos em uma única plataforma e tome
            decisões mais inteligentes.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Crie sua conta
            </h1>
            <p className="text-slate-600">
              Comece a consolidar seus investimentos em minutos
            </p>
          </div>

          {/* Form */}
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Nome completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome completo"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crie uma senha"
                          {...field}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Confirmar senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          {...field}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#549d8c] to-[#2e6669] hover:from-[#498a7d] hover:to-[#235256] text-white font-medium cursor-pointer"
              >
                Criar conta
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Já tem uma conta? </span>
            <Link
              href="/entrar"
              className="text-[#549d8c] font-medium hover:text-[#2e6669] transition-colors"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
