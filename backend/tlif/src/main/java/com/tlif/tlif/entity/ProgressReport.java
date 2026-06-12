package com.tlif.tlif.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "progress_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProgressReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grantee_id", nullable = false)
    private Grantee grantee;

    @Column(nullable = false)
    private String quarter;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate submittedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.UPCOMING;
 
    public enum ReportStatus {
        SUBMITTED, UPCOMING, OVERDUE
    }
}
