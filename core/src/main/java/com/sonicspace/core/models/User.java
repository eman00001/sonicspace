package com.sonicspace.core.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    private UUID id;
    private String username;
    private String email;
    private String createdAt;
}
