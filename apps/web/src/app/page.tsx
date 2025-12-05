import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 border-b border-slate-100">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/zuno-logo.svg"
              alt="Zuno"
              width={40}
              height={40}
              className="size-28"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-slate-700 hover:text-[#549d8c]"
            >
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-[#549d8c] to-[#2e6669] hover:from-[#498a7d] hover:to-[#235256]"
            >
              <Link href="/registrar">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="container mx-auto text-center space-y-10 max-w-4xl">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight text-slate-900">
            Simplifique sua{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#549d8c] to-[#2e6669] bg-clip-text text-transparent">
                jornada financeira
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Acompanhe investimentos, analise performance e monitore dividendos
            em um só lugar.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              asChild
              className="text-lg px-12 py-8 rounded-md bg-gradient-to-r from-[#549d8c] to-[#2e6669] hover:from-[#498a7d] hover:to-[#235256] shadow-lg shadow-[#549d8c]/25"
            >
              <Link href="/registrar">Começar Gratuitamente</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-100">
        <div className="container mx-auto text-center text-sm text-slate-500">
          <p>© 2025 Zuno. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
