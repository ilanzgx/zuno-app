package com.ilanzgx.demo.modules.position.application.dto.position;

import lombok.Builder;

@Builder
public record PositionResponseWithoutUser(String id, String ticker, Integer amount) {}
