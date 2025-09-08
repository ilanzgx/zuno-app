package com.ilanzgx.demo.modules.stock.domain.services;

import org.springframework.http.ResponseEntity;

public interface StockDataService {
    ResponseEntity<String> getStockData(String ticker);
}
