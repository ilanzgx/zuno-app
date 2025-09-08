package com.ilanzgx.demo.modules.stock.application;

import lombok.Builder;

@Builder
public record StockRequest(String ticker, Integer amount, String userId) {}
