package com.ilanzgx.demo.modules.position.application.dto.position;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record PositionResponseWithData(String id, String ticker, int quantity, BigDecimal averagePrice, Object positionData) {}
