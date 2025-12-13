package com.ilanzgx.demo.modules.market.application;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.shared.domain.HttpFetch;
import com.ilanzgx.demo.modules.market.domain.MarketService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketServiceImpl implements MarketService {
    private final HttpFetch httpFetch;

    @Value("${BRAPI_URL}")
    private String apiUrl;

    @Value("${BRAPI_TOKEN}")
    private String apiToken;

    @Value("${market.microservice.url}")
    private String marketMicroserviceUrl;

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "simpleStockData", key = "#ticker")
    public Map<String, Object> getSimpleStockData(String ticker) {
        System.out.println("Buscando dados simples da API externa para o ticker: " + ticker);

        try {
            ResponseEntity<Map> response = httpFetch.get(
                    this.apiUrl + "/api/quote/" + ticker,
                    Map.of(
                            "Authorization", "Bearer " + this.apiToken,
                            "Accept", "application/json"),
                    Map.class);

            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar dados para o ticker " + ticker + ": " + e.getMessage());
            return Map.of(
                "error", true,
                "message", "Dado indisponível no momento",
                "ticker", ticker
            );
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "fullStockData", key = "#ticker")
    public Map<String, Object> getFullStockData(String ticker) {
        System.out.println("Buscando dados completos da API externa para o ticker: " + ticker);

        try {
            ResponseEntity<Map> response = httpFetch.get(
                    this.apiUrl + "/api/quote/" + ticker + "?modules=summaryProfile&fundamental=true",
                    Map.of(
                            "Authorization", "Bearer " + this.apiToken,
                            "Accept", "application/json"),
                    Map.class);

            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar dados completos para o ticker " + ticker + ": " + e.getMessage());
            return Map.of(
                    "error", true,
                    "message", "Dado indisponível no momento",
                    "ticker", ticker);
        }
    }

    /* Métodos do meu microserviço */
    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "stockDividendsData", key = "#ticker + '_' + #fromDate")
    public Map<String, Object> getStockDividendsData(String ticker, String fromDate) {
        System.out.println("Buscando dados de dividendos através do microserviço para o ticker: " + ticker
                + " a partir de: " + fromDate);

        try {
            String url = this.marketMicroserviceUrl + "/b3/dividends/" + ticker;
            if (fromDate != null && !fromDate.isEmpty()) {
                url += "?from_date=" + fromDate;
            }

            ResponseEntity<Map> response = httpFetch.get(
                    url,
                    Map.of("Accept", "application/json"),
                    Map.class);

            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar dados completos para o ticker " + ticker + ": " + e.getMessage());
            return Map.of(
                    "error", true,
                    "message", "Dado indisponível no momento",
                    "ticker", ticker);
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "priceOnDate", key = "#ticker + #date")
    public Map<String, Object> getPriceOnDate(String ticker, String date) {
        try {
            String url = this.marketMicroserviceUrl + "/b3/quote/" + ticker + "?date=" + date;

            ResponseEntity<Map> response = httpFetch.get(
                    url,
                    Map.of("Accept", "application/json"),
                    Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar preço histórico: " + e.getMessage());
            return Map.of("error", "Preço não encontrado para a data");
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "currentPrice", key = "#ticker")
    public Map<String, Object> getCurrentPrice(String ticker) {
        try {
            String url = this.marketMicroserviceUrl + "/b3/quote/" + ticker;

            ResponseEntity<Map> response = httpFetch.get(
                    url,
                    Map.of("Accept", "application/json"),
                    Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar preço atual: " + e.getMessage());
            return Map.of("error", "Preço não encontrado");
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "stockNews", key = "#ticker")
    public Map<String, Object> getStockNews(String ticker) {
        try {
            String url = this.marketMicroserviceUrl + "/b3/news/" + ticker;

            ResponseEntity<Map> response = httpFetch.get(
                    url,
                    Map.of("Accept", "application/json"),
                    Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Erro ao buscar notícias: " + e.getMessage());
            return Map.of("error", "Notícias não encontradas");
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "stockHistory", key = "#ticker")
    public List<Map<String, Object>> getStockHistory(String ticker) {
        try {
            String url = this.marketMicroserviceUrl + "/b3/history/" + ticker;
            ResponseEntity<Map> response = httpFetch.get(url, Map.of("Accept", "application/json"), Map.class);
            if (response.getBody() != null && response.getBody().containsKey("history")) {
                return (List<Map<String, Object>>) response.getBody().get("history");
            }
            return List.of();
        } catch (Exception e) {
            System.err.println("Erro ao buscar histórico: " + e.getMessage());
            return List.of();
        }
    }

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "stockHistoryMultiple", key = "#tickers.hashCode()")
    public Map<String, List<Map<String, Object>>> getStockHistoryForTickers(Set<String> tickers) {
        Map<String, List<Map<String, Object>>> result = new java.util.HashMap<>();

        if (tickers == null || tickers.isEmpty()) {
            return result;
        }

        try {
            String tickersParam = String.join(",", tickers);
            String url = this.marketMicroserviceUrl + "/b3/history?tickers=" + tickersParam;

            ResponseEntity<Map> response = httpFetch.get(url, Map.of("Accept", "application/json"), Map.class);

            if (response.getBody() != null && response.getBody().containsKey("histories")) {
                List<Map<String, Object>> histories = (List<Map<String, Object>>) response.getBody().get("histories");

                for (Map<String, Object> tickerHistory : histories) {
                    String ticker = (String) tickerHistory.get("ticker");
                    List<Map<String, Object>> history = (List<Map<String, Object>>) tickerHistory.get("history");
                    result.put(ticker, history != null ? history : List.of());
                }
            }

            return result;
        } catch (Exception e) {
            System.err.println("Erro ao buscar histórico para múltiplos tickers: " + e.getMessage());
            return result;
        }
    }
}

