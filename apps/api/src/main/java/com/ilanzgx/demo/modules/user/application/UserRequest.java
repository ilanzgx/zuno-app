package com.ilanzgx.demo.modules.user.application;

import lombok.Builder;

@Builder
public record UserRequest(String id, String name, String email, String password) {}
