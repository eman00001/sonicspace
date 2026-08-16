package com.sonicspace.core.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.sonicspace.core.models.User;
import com.sonicspace.core.services.UserService;

@Controller
public class UserController {
    
    @Autowired
    UserService userService;
    
    @QueryMapping
    public User user(@Argument String id) {
        return userService.findById(id);
    }
    
}