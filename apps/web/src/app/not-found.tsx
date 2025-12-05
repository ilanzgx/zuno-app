import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-[#549d8c] to-[#2e6669] bg-clip-text text-transparent">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            Página não encontrada
          </h2>
          <p className="text-slate-600">
            A página que você procura não existe ou foi movida.
          </p>
        </div>

        <Button
          asChild
          className="bg-gradient-to-r from-[#549d8c] to-[#2e6669] hover:from-[#498a7d] hover:to-[#235256]"
        >
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
}
