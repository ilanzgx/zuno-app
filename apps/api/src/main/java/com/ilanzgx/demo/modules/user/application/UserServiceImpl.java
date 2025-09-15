package com.ilanzgx.demo.modules.user.application;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.config.PasswordConfig;
import com.ilanzgx.demo.modules.user.application.dto.CreateUserDto;
import com.ilanzgx.demo.modules.user.application.dto.UpdateUserDto;
import com.ilanzgx.demo.modules.user.application.dto.UserResponse;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;
import com.ilanzgx.demo.modules.user.domain.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordConfig passwordConfig;

    @Override
    public User createUser(CreateUserDto createUserDto) {
        User user = userMapper.toEntity(createUserDto);
        user.setPassword(this.passwordConfig.passwordEncoder().encode(user.getPassword()));
        System.out.println(user.getPassword());
        return this.userRepository.save(user);
    }

    @Override
    public Optional<User> getUser(String id) {
        return this.userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        return Optional.ofNullable(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = this.userRepository.findAll();
        return users.stream()
            .map(userMapper::toResponse)
            .toList();
    }

    @Override
    public User updateUser(String id, UpdateUserDto updateUserDto) {
        User userExists = this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userExists.setName(updateUserDto.name());
        userExists.setEmail(updateUserDto.email());
        userExists.setPassword(updateUserDto.password());

        return this.userRepository.save(userExists);
    }

    @Override
    public void deleteUser(String id) {
        if(!this.userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        this.userRepository.deleteById(id);
    }
}
