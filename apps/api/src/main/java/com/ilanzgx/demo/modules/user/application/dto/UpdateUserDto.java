package com.ilanzgx.demo.modules.user.application.dto;

import lombok.Builder;

@Builder
public record UpdateUserDto(String name, String email, String password) {}
