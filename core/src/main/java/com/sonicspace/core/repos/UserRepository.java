package com.sonicspace.core.repos;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sonicspace.core.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
}
