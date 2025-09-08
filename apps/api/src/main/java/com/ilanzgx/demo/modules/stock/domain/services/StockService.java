package com.ilanzgx.demo.modules.stock.domain.services;

import java.util.List;

import com.ilanzgx.demo.modules.stock.application.StockRequest;
import com.ilanzgx.demo.modules.stock.application.StockResponse;
import com.ilanzgx.demo.modules.stock.domain.Stock;

public interface StockService {
    Stock createStock(StockRequest stockRequest);
    StockResponse getStock(String id);
    List<StockResponse> getAllStocks();
    StockResponse updateStock(String id, StockRequest stockRequest);
    void deleteStock(String id);
}
