package com.sonicspace.core.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sonicspace.core.models.User;
import com.sonicspace.core.repos.UserRepository;

@Service
public class UserService {
    @Autowired
    UserRepository userRepo;
    
    public Optional<User> findById(String id) {
        UUID uuid = UUID.fromString(id);
        return userRepo.findById(uuid);
    }
}
