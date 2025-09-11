package com.ilanzgx.demo.modules.stock.application.dto.stock;

import lombok.Builder;

@Builder
public record StockResponseWithoutUser(String id, String ticker, Integer amount) {}
