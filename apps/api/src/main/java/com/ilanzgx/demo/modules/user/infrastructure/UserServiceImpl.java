package com.ilanzgx.demo.modules.user.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;
import com.ilanzgx.demo.modules.user.domain.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return this.userRepository.save(user);
    }

    @Override
    public Optional<User> getUser(String id) {
        return this.userRepository.findById(id);
    }

    @Override
    public List<User> getAllUsers() {
        List<User> users = this.userRepository.findAll();
        return users;
    }

    @Override
    public User updateUser(User user) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateUser'");
    }

    @Override
    public void deleteUser(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteUser'");
    }

}
