package com.ilanzgx.demo.modules.position.application.dto.position;

import lombok.Builder;

@Builder
public record PositionResponseWithData(String id, String ticker, int amount, Object positionData) {}
