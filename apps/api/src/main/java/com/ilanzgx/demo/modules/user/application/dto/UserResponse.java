package com.ilanzgx.demo.modules.user.application.dto;

import lombok.Builder;

@Builder
public record UserResponse(String id, String name, String email) {}
