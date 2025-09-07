package com.ilanzgx.demo.modules.user.application;

import org.springframework.stereotype.Component;

import com.ilanzgx.demo.modules.user.application.dto.CreateUserDto;
import com.ilanzgx.demo.modules.user.application.dto.UpdateUserDto;
import com.ilanzgx.demo.modules.user.domain.User;

@Component
public class UserMapper {
    public User toEntity(UserRequest userRequest) {
        return User.builder()
                .id(userRequest.id())
                .name(userRequest.name())
                .email(userRequest.email())
                .password(userRequest.password())
                .build();
    }

    public User toEntity(CreateUserDto createUserDto) {
        return User.builder()
                .name(createUserDto.name())
                .email(createUserDto.email())
                .password(createUserDto.password())
                .build();
    }

    public User toEntity(UpdateUserDto updateUserDto) {
        return User.builder()
                .name(updateUserDto.name())
                .email(updateUserDto.email())
                .password(updateUserDto.password())
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
