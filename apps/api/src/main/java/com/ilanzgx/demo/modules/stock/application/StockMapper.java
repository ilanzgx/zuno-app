package com.ilanzgx.demo.modules.stock.application;

import org.springframework.stereotype.Component;

import com.ilanzgx.demo.modules.stock.domain.Stock;

@Component
public class StockMapper {
    /*
    public Stock toEntity(StockRequest stockRequest) {
        return Stock.builder()
                .ticker(stockRequest.ticker())
                .amount(stockRequest.amount())
                .userId(stockRequest.userId())
                .build();
    }
    */
    public StockResponse toResponse(Stock stock) {
        return StockResponse.builder()
                .id(stock.getId())
                .ticker(stock.getTicker())
                .amount(stock.getAmount())
                .user(stock.getPropertyOwner())
                .build();
    }
}
