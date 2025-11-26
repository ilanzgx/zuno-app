package com.ilanzgx.demo.modules.position.application.dto.position;

import com.ilanzgx.demo.modules.user.application.dto.UserResponse;

import lombok.Builder;

@Builder
public record PositionResponse(String id, String ticker, Integer amount, UserResponse user) {}
