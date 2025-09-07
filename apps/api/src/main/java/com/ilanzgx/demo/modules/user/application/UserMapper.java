package com.ilanzgx.demo.modules.user.application;

import org.mapstruct.Mapper;

import com.ilanzgx.demo.modules.user.domain.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequest userRequest);
    UserResponse toResponse(User user);
}
