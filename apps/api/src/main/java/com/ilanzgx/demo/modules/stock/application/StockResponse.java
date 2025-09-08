package com.ilanzgx.demo.modules.stock.application;

import com.ilanzgx.demo.modules.user.domain.User;

import lombok.Builder;

@Builder
public record StockResponse(String id, String ticker, Integer amount, User user) {}
