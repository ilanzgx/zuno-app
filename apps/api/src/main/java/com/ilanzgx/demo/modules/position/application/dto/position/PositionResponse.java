package com.ilanzgx.demo.modules.position.application.dto.position;

import java.math.BigDecimal;

import com.ilanzgx.demo.modules.shared.domain.AssetType;
import com.ilanzgx.demo.modules.user.application.dto.UserResponse;

import lombok.Builder;

@Builder
public record PositionResponse(String id, String ticker, Integer quantity, AssetType assetType, BigDecimal averagePrice, UserResponse user) {}
