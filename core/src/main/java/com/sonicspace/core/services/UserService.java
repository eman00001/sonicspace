package com.sonicspace.core.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.sonicspace.core.models.User;
import com.sonicspace.core.repos.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {
    @Autowired
    UserRepository userRepo;
    
    public Optional<User> findById(String id) {
        UUID uuid = UUID.fromString(id);
        return userRepo.findById(uuid);
    }

    public Optional<User> findByCognitoSub(@AuthenticationPrincipal Jwt jwt) {
        String cognitoSub = jwt.getSubject();
        log.info("JWT: {}", jwt);
        return userRepo.findByCognitoSub(cognitoSub)
            .or(() -> {
                String email = jwt.getClaimAsString("email");
                String username = jwt.getClaimAsString("username");
                return Optional.of(createUserFromCognito(cognitoSub, username, email));
            });
    }

    private User createUserFromCognito(String cognitoSub, String username, String email) {
        User newUser = new User();
        newUser.setCognitoSub(cognitoSub);
        newUser.setEmail(email);
        newUser.setUsername(username);
        return userRepo.save(newUser);
    }

}
