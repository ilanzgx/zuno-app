package com.ilanzgx.demo.modules.user.infrastructure;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.user.application.UserMapper;
import com.ilanzgx.demo.modules.user.application.UserResponse;
import com.ilanzgx.demo.modules.user.application.dto.CreateUserDto;
import com.ilanzgx.demo.modules.user.application.dto.UpdateUserDto;
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
    public UserResponse createUser(@RequestBody CreateUserDto createUserDto) {
        User user = this.userService.createUser(
            CreateUserDto.builder()
                .name(createUserDto.name())
                .email(createUserDto.email())
                .password(createUserDto.password())
                .build());
        return userMapper.toResponse(user);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return this.userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable String id) {
        return this.userService.getUser(id).map(userMapper::toResponse).orElse(null);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable String id, @RequestBody UpdateUserDto updateUserDto) {
        User updatedUser = this.userService.updateUser(id,
                UpdateUserDto.builder()
                        .name(updateUserDto.name())
                        .email(updateUserDto.email())
                        .password(updateUserDto.password())
                        .build());
        return userMapper.toResponse(updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        this.userService.deleteUser(id);
    }
}
