package com.ilanzgx.demo.modules.auth.infrastructure;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.auth.application.JwtServiceImpl;
import com.ilanzgx.demo.modules.auth.application.dto.AuthResponse;
import com.ilanzgx.demo.modules.auth.application.dto.LoginRequest;
import com.ilanzgx.demo.modules.user.application.dto.CreateUserDto;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtServiceImpl jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody CreateUserDto request) {
        User newUser = userService.createUser(request);
        String token = jwtService.generateToken(newUser);
        return AuthResponse.builder().token(token).build();
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userService.getUserByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        String token = jwtService.generateToken(user);
        return AuthResponse.builder().token(token).build();
    }
}
