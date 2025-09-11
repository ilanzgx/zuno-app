package com.ilanzgx.demo.modules.stock.application.dto.stock;

import com.ilanzgx.demo.modules.user.application.UserResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record UserStockResponse(UserResponse user, List<StockResponseWithData> stocks) {}
