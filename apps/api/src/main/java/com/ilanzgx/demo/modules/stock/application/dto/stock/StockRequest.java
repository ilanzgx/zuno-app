package com.ilanzgx.demo.modules.stock.application.dto.stock;

import lombok.Builder;

@Builder
public record StockRequest(String ticker, Integer amount, String userId) {}
