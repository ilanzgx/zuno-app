package com.ilanzgx.demo.modules.stock.application.dto.stock;

import com.ilanzgx.demo.modules.user.application.UserResponse;

import lombok.Builder;

@Builder
public record StockResponse(String id, String ticker, Integer amount, UserResponse user) {}
