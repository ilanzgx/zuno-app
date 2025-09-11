package com.ilanzgx.demo.modules.stock.infrastructure.services;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.shared.domain.HttpFetch;
import com.ilanzgx.demo.modules.stock.domain.services.StockDataService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockDataServiceImpl implements StockDataService {
    private final HttpFetch httpFetch;

    @Override
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> getStockData(String ticker) {
        ResponseEntity<Map> response = httpFetch.get(
            "https://brapi.dev/api/quote/" + ticker,
            Map.of(
                    "Authorization", "Bearer token",
                    "Accept", "application/json"
            ),
            Map.class
        );

        return (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) response;
    }

}
