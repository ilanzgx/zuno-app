package com.ilanzgx.demo.modules.stock.domain.services;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface StockDataService {
    ResponseEntity<Map<String, Object>> getStockData(String ticker);
}
