package com.tlif.tlif.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tlif.tlif.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
    Optional<User> findByMicrosoftId(String microsoftId);
}
