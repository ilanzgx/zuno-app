package com.ilanzgx.demo.modules.auth.application.dto;

import lombok.Builder;

@Builder
public record AuthResponse(String token) {}
