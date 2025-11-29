package com.ilanzgx.demo.modules.position.application.dto.position;

import java.math.BigDecimal;

import com.ilanzgx.demo.modules.shared.domain.AssetType;
import lombok.Builder;

@Builder
public record PositionResponseWithData(String id, String ticker, int quantity, AssetType assetType, BigDecimal averagePrice, Object positionData) {}
