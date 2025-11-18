import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/registrar">Criar Conta</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Centralize sua vida financeira
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Acompanhe seu patrimônio, analise a performance e monitore
            dividendos com dados unificados de todas as suas corretoras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base font-medium" asChild>
              <Link href="/registrar">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 InvestHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
