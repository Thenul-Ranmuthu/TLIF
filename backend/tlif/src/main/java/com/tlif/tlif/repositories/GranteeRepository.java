package com.tlif.tlif.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tlif.tlif.entity.Grantee;

public interface GranteeRepository extends JpaRepository<Grantee, Long>{
    
    Optional<Grantee> findByEmail(String email);
    List<Grantee> findByNameContainingIgnoreCaseOrFacultyContainingIgnoreCase(String name, String faculty);
}
