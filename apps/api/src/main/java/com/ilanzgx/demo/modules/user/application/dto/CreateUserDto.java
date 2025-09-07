package com.ilanzgx.demo.modules.user.application.dto;

import lombok.Builder;

@Builder
public record CreateUserDto(String name, String email, String password) {}
