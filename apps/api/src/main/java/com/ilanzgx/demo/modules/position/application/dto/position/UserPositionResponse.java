package com.ilanzgx.demo.modules.position.application.dto.position;

import lombok.Builder;

import java.util.List;

import com.ilanzgx.demo.modules.user.application.dto.UserResponse;

@Builder
public record UserPositionResponse(UserResponse user, List<PositionResponseWithData> positions) {}
