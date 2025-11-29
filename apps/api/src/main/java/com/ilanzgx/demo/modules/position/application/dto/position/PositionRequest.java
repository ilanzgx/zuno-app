package com.ilanzgx.demo.modules.position.application.dto.position;

import com.ilanzgx.demo.modules.shared.domain.AssetType;
import lombok.Builder;

@Builder
public record PositionRequest(String ticker, Integer quantity, AssetType assetType, String userId) {}
