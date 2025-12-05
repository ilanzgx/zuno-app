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
import { signInSchema } from "@/resources/user/user.schemas";
import { signIn } from "@/resources/user/user.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function Entrar() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    console.log(values);
    try {
      console.log(process.env.NEXT_PUBLIC_API_URL);
      await signIn(values);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-600">
              Acesse sua conta para gerenciar seus investimentos
            </p>
          </div>

          {/* Form */}
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={signInForm.control}
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
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Senha
                      </FormLabel>
                      <Link
                        href="/recuperar-senha"
                        className="text-xs text-[#549d8c] hover:text-[#2e6669] transition-colors"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
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
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#549d8c] to-[#2e6669] hover:from-[#498a7d] hover:to-[#235256] text-white font-medium cursor-pointer"
              >
                Entrar
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Não tem uma conta? </span>
            <Link
              href="/registrar"
              className="text-[#549d8c] font-medium hover:text-[#2e6669] transition-colors"
            >
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Background */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#549d8c] to-[#2e6669] items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-white">
          <h2 className="text-4xl font-bold">
            Simplifique sua jornada financeira
          </h2>
          <p className="text-lg text-white/90">
            Acompanhe investimentos, analise performance e monitore dividendos
            em um só lugar.
          </p>
        </div>
      </div>
    </div>
  );
}
