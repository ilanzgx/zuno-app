package com.ilanzgx.demo.modules.position.application.dto.position;

import lombok.Builder;

@Builder
public record PositionRequest(String ticker, Integer amount, String userId) {}
