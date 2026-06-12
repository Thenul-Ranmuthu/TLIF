package com.tlif.tlif.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tlif.tlif.entity.ProgressReport;
import com.tlif.tlif.entity.ProgressReport.ReportStatus;

public interface ProgressReportRepository extends JpaRepository<ProgressReport, Long>{
    
    List<ProgressReport> findByGranteeId(Long granteeId);

    List<ProgressReport> findByStatus(ReportStatus status);
}
