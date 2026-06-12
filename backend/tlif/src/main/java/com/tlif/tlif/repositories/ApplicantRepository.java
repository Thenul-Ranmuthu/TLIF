package com.tlif.tlif.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tlif.tlif.entity.Applicant;
import com.tlif.tlif.entity.Applicant.ApplicationStatus;

public interface ApplicantRepository extends JpaRepository<Applicant, Long>{
    
    List<Applicant> findByStatus(ApplicationStatus status);
    Optional<Applicant> findByEmail(String Email);
    List<Applicant> findByNameContainingIgnoreCaseOrFacultyContainingIgnoreCase(String name, String faculty);
    
}
