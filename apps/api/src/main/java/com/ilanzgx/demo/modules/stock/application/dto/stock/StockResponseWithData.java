package com.ilanzgx.demo.modules.stock.application.dto.stock;

import lombok.Builder;

@Builder
public record StockResponseWithData(String id, String ticker, int amount, Object stockData) {}
