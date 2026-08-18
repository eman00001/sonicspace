package com.sonicspace.core.controllers;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.sonicspace.core.models.User;
import com.sonicspace.core.services.UserService;

@Controller
@CrossOrigin
public class UserController {
    
    @Autowired
    UserService userService;
    
    @QueryMapping
    public Optional<User> user(@Argument String id) {
        return userService.findById(id);
    }
    
    @QueryMapping
    public User me(@AuthenticationPrincipal Jwt jwt) {
        return userService
            .findByCognitoSub(jwt)
            .orElseThrow();
    }
}