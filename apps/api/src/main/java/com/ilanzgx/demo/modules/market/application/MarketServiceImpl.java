package com.ilanzgx.demo.modules.market.application;

import java.util.Map;

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

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "stockDividendsData", key = "#ticker + '_' + #fromDate")
    public Map<String, Object> getStockDividendsData(String ticker, String fromDate) {
        System.out.println("Buscando dados de dividendos através do microserviço para o ticker: " + ticker + " a partir de: " + fromDate);

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

}
