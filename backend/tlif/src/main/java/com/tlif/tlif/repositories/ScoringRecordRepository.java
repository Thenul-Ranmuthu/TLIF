package com.tlif.tlif.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tlif.tlif.entity.ScoringRecord;

public interface ScoringRecordRepository extends JpaRepository<ScoringRecord, Long>{
    
    Optional<ScoringRecord> findByApplicantId(Long applicantId);
    List<ScoringRecord> findAllByOrderByTotalScoreDesc();
}
