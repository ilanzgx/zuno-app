"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BarChart3, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Consolidador de Investimentos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Gerencie seus investimentos de forma inteligente e eficiente. Tenha
            controle total sobre seu portfolio em um único lugar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Análise Detalhada</CardTitle>
              <CardDescription>
                Visualize o desempenho dos seus investimentos com gráficos
                interativos e relatórios detalhados.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">
                Acompanhamento em Tempo Real
              </CardTitle>
              <CardDescription>
                Monitore suas ações, FIIs e criptomoedas com atualizações em
                tempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Segurança Garantida</CardTitle>
              <CardDescription>
                Seus dados estão protegidos com criptografia de ponta e
                segurança de nível bancário.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Comece Agora</CardTitle>
              <CardDescription>
                Junte-se a milhares de investidores que já gerenciam seus
                investimentos conosco.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/entrar" passHref>
                <Button size="lg" className="w-full">
                  Entrar na Plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/registrar" passHref>
                <Button variant="outline" size="lg" className="w-full">
                  Criar Conta Gratuita
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              10K+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Usuários Ativos
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              R$50M+
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Em Investimentos
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              99.9%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Disponibilidade
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400">Suporte</div>
          </div>
        </div>
      </div>
    </div>
  );
}
