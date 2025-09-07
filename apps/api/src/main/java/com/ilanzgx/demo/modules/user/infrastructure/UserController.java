package com.ilanzgx.demo.modules.user.infrastructure;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.user.application.UserMapper;
import com.ilanzgx.demo.modules.user.application.UserRequest;
import com.ilanzgx.demo.modules.user.application.UserResponse;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    public UserResponse createUser(@RequestBody UserRequest userRequest) {
        User user = userMapper.toEntity(userRequest);
        User savedUser = this.userService.createUser(user);
        return userMapper.toResponse(savedUser);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        List<User> users = this.userService.getAllUsers();
        return users.stream().map(userMapper::toResponse).toList();
    }
}
