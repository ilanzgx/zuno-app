package com.ilanzgx.demo.modules.user.domain;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUser(String id);
    List<User> getAllUsers();
    User updateUser(User user);
    void deleteUser(String id);
}
