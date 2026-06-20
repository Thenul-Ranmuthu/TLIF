package com.tlif.tlif.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tlif.tlif.Enums.UserRole;
import com.tlif.tlif.dto.ApplicantDto;
import com.tlif.tlif.dto.GranteeDto;
import com.tlif.tlif.entity.Applicant;
import com.tlif.tlif.entity.Grantee;
import com.tlif.tlif.exceptions.ResourceNotFoundException;
import com.tlif.tlif.repositories.ApplicantRepository;
import com.tlif.tlif.repositories.GranteeRepository;
import com.tlif.tlif.repositories.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final GranteeRepository granteeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ApplicantDto.Summary> getAllApplicants() {
        return applicantRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicantDto.Response updateStatus(Long id, ApplicantDto.UpdateStatusRequest req) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found: " + id));

        applicant.setStatus(req.getStatus());
        applicantRepository.save(applicant);
        return toResponse(applicant);
    }

    @Transactional
    public GranteeDto.Response promoteToGrantee(Long applicantId, Long amountAllocated) {
        
        Applicant applicant = applicantRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant not found: " + applicantId));

    if(applicant.getStatus() != Applicant.ApplicationStatus.SELECTED){
            throw new IllegalStateException(
                    "Only SELECTED applicants can be promoted. Current status: " + applicant.getStatus());
        }

        if (granteeRepository.existsByEmail(applicant.getEmail())) {
            throw new IllegalStateException(
                    "A grantee record already exists for email: " + applicant.getEmail());
        }

        // Resolve amount to allocate
        Long resolvedAmount = (amountAllocated != null && amountAllocated > 0)
                ?amountAllocated
                :applicant.getAmountRequested();

         // Create grantee record
        Grantee grantee = Grantee.builder()
                .name(applicant.getName())
                .faculty(applicant.getFaculty())
                .email(applicant.getEmail())
                .researchTitle(applicant.getResearchTitle())
                .amountAllocated(resolvedAmount)
                .build();

        grantee = granteeRepository.save(grantee);

        // Upgrade user role if a User account exists for this email
        userRepository.findByEmail(applicant.getEmail()).ifPresent(user -> {
            user.setRole(UserRole.GRANTEE);
            userRepository.save(user);
        });

        return buildGranteeResponse(grantee);

    }

    private ApplicantDto.Summary toSummary(Applicant a) {
        return ApplicantDto.Summary.builder()
                .id(a.getId())
                .name(a.getName())
                .faculty(a.getFaculty())
                .email(a.getEmail())
                .researchTitle(a.getResearchTitle())
                .amountRequested(a.getAmountRequested())
                .status(a.getStatus())
                .build();
    }
 
    private ApplicantDto.Response toResponse(Applicant a) {
        return ApplicantDto.Response.builder()
                .id(a.getId())
                .name(a.getName())
                .faculty(a.getFaculty())
                .email(a.getEmail())
                .researchTitle(a.getResearchTitle())
                .amountRequested(a.getAmountRequested())
                .status(ApplicantDto.Response.ApplicationStatus.valueOf(a.getStatus().name()))
                .build();
    }
 
    private GranteeDto.Response buildGranteeResponse(Grantee g) {
        return GranteeDto.Response.builder()
                .id(g.getId())
                .name(g.getName())
                .faculty(g.getFaculty())
                .email(g.getEmail())
                .researchTitle(g.getResearchTitle())
                .amountAllocated(g.getAmountAllocated())
                .totalApproved(0L)
                .totalSpent(0L)
                .remaining(g.getAmountAllocated())
                .utilizationPercent(0)
                .pendingReceiptsCount(0)
                .hasOverdueReport(false)
                .budgetCategories(List.of())
                .receipts(List.of())
                .progressReports(List.of())
                .build();
    }
}
