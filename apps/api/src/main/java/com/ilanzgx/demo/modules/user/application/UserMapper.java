package com.ilanzgx.demo.modules.user.application;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.ilanzgx.demo.modules.user.domain.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    User toEntity(UserRequest userRequest);

    UserResponse toResponse(User user);
}
