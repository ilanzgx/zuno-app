package com.ilanzgx.demo.modules.market.application.services;

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

    @Override
    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Cacheable(value = "market", key = "#ticker")
    public Map<String, Object> getMarket(String ticker) {
        System.out.println("Buscando dados da API externa para o ticker: " + ticker);

        ResponseEntity<Map> response = httpFetch.get(
            this.apiUrl + "/api/quote/" + ticker + "?modules=summaryProfile&fundamental=true",
            Map.of(
                    "Authorization", "Bearer " + this.apiToken,
                    "Accept", "application/json"
            ),
            Map.class
        );

        return response.getBody();
    }

}
