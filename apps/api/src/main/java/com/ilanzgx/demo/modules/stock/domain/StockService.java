package com.ilanzgx.demo.modules.stock.domain;

import com.ilanzgx.demo.modules.stock.application.StockRequest;

public interface StockService {
    Stock createStock(StockRequest stockRequest);
}
