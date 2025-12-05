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

interface NewsCardProps {
  id: string;
  relatedTicker: string;
  content: {
    title: string;
    pubDate: string;
    summary?: string;
    description?: string;
    thumbnail?: {
      resolutions: Array<{
        url: string;
      }>;
    };
    clickThroughUrl?: {
      url: string;
    };
  };
  link?: string;
}

export function NewsCard({ id, relatedTicker, content, link }: NewsCardProps) {
  const hasThumbnail =
    content.thumbnail && content.thumbnail.resolutions.length > 0;
  const thumbnailUrl = hasThumbnail
    ? content.thumbnail?.resolutions[0].url
    : null;

  const newsUrl = link || content.clickThroughUrl?.url;
  const formattedDate = new Date(content.pubDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      {thumbnailUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={content.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}

      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="font-bold">
            {relatedTicker}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {formattedDate}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-3">
          {content.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pb-3">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {content.summary || content.description || "Sem resumo disponível."}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          size="sm"
          className="w-full text-white bg-blue-500 hover:bg-blue-600"
          asChild
        >
          <a
            href={newsUrl}
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
}
