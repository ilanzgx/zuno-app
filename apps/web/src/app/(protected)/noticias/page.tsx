import { getPositionsNewsByUser } from "@/resources/position/position.service";
import { NewsCard } from "./components/news-card";
import { Calendar } from "lucide-react";

export default async function Noticias() {
  const newsData = await getPositionsNewsByUser();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Notícias do Mercado
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe as últimas notícias relacionadas aos ativos da sua carteira.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsData?.news?.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            relatedTicker={item.relatedTicker}
            content={item.content}
            link={item.link}
          />
        ))}

        {(!newsData?.news || newsData.news.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Não encontramos notícias recentes para os ativos da sua carteira
              no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
