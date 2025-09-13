package com.ilanzgx.demo.modules.stock.application.dto.stock;

import lombok.Builder;

import java.util.List;

import com.ilanzgx.demo.modules.user.application.dto.UserResponse;

@Builder
public record UserStockResponse(UserResponse user, List<StockResponseWithData> stocks) {}
