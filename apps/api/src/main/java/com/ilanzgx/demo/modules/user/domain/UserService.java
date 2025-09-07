package com.ilanzgx.demo.modules.user.domain;

import java.util.List;
import java.util.Optional;

import com.ilanzgx.demo.modules.user.application.UserResponse;
import com.ilanzgx.demo.modules.user.application.dto.CreateUserDto;
import com.ilanzgx.demo.modules.user.application.dto.UpdateUserDto;

public interface UserService {
    User createUser(CreateUserDto createUserDto);
    Optional<User> getUser(String id);
    List<UserResponse> getAllUsers();
    User updateUser(String id, UpdateUserDto updateUserDto);
    void deleteUser(String id);
}
