import { getPositionsNewsByUser } from "@/resources/position/position.service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import Image from "next/image";

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
        {newsData?.news?.map((item) => {
          const hasThumbnail =
            item.content.thumbnail &&
            item.content.thumbnail.resolutions.length > 0;
          const thumbnailUrl = hasThumbnail
            ? item.content.thumbnail?.resolutions[0].url
            : null;

          return (
            <Card
              key={item.id}
              className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow"
            >
              {thumbnailUrl && (
                <div className="relative w-full h-48 overflow-hidden bg-muted">
                  <img
                    src={thumbnailUrl}
                    alt={item.content.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
              )}

              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-bold">
                    {item.relatedTicker}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(item.content.pubDate).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-3">
                  {item.content.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow pb-3">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {item.content.summary ||
                    item.content.description ||
                    "Sem resumo disponível."}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={item.link || item.content.clickThroughUrl?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Ler notícia completa
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}

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
