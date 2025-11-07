import Link from "next/link";
import {
  TrendingUp,
  PieChart,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">InvestHub</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/entrar"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
            <Button asChild>
              <Link href="/registrar">Começar Agora</Link>
            </Button>
          </nav>

          <div className="md:hidden flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/registrar">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="size-4" />
            Gerencie todos os seus investimentos em um só lugar
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            Centralize sua vida financeira
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Acompanhe seu patrimônio, analise performance, monitore dividendos e
            tome decisões mais inteligentes com dados unificados de todas as
            suas corretoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/registrar">Começar Gratuitamente</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base bg-transparent"
              asChild
            >
              <Link href="/entrar">Fazer Login</Link>
            </Button>
          </div>

          {/* Hero Image/Illustration */}
          <div className="pt-12">
            <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
              <img
                src="/modern-financial-dashboard-with-charts-and-graphs.jpg"
                alt="Dashboard de investimentos moderno com gráficos e análises"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tudo que você precisa
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas para gerenciar e otimizar seus investimentos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChart className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Visão Consolidada</h3>
            <p className="text-muted-foreground">
              Agregue dados de múltiplas corretoras e visualize todo seu
              patrimônio em um único dashboard intuitivo.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Análise de Performance</h3>
            <p className="text-muted-foreground">
              Acompanhe a evolução do seu portfólio com gráficos detalhados e
              compare com benchmarks do mercado.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">
              Monitoramento de Dividendos
            </h3>
            <p className="text-muted-foreground">
              Acompanhe todos os seus proventos, veja calendários de pagamento e
              projete sua renda passiva.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Alocação de Ativos</h3>
            <p className="text-muted-foreground">
              Visualize a distribuição dos seus investimentos por classe de
              ativo, setor e estratégia.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Segurança Total</h3>
            <p className="text-muted-foreground">
              Seus dados são criptografados e protegidos com os mais altos
              padrões de segurança do mercado.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">
              Atualizações em Tempo Real
            </h3>
            <p className="text-muted-foreground">
              Receba notificações instantâneas sobre mudanças importantes no seu
              portfólio.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <Card className="max-w-4xl mx-auto p-12 text-center space-y-6 bg-primary text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de investidores que já estão otimizando suas
            estratégias com o InvestHub.
          </p>
          <div className="pt-4">
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <Link href="/registrar">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="size-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">InvestHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Centralize e otimize seus investimentos em uma única plataforma.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Preços
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrações
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#about"
                    className="hover:text-foreground transition-colors"
                  >
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Termos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Segurança
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 InvestHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
