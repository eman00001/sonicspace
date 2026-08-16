package com.sonicspace.core.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    private String id;
    private String username;
    private String email;
    private String createdAt;
}
