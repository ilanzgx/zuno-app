package com.ilanzgx.demo.modules.stock.domain.services;

import java.util.Map;

public interface StockDataService {
    Map<String, Object> getStockData(String ticker);
}
