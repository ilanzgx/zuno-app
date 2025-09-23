"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Hello World!</h1>
      <div className="flex">
        <div className="w-1/2">
          <Link href="/entrar" passHref>
            <Button>Entrar</Button>
          </Link>
        </div>
        <div className="w-1/2">
          <Button>Cadastrar</Button>
        </div>
      </div>
    </>
  );
}
