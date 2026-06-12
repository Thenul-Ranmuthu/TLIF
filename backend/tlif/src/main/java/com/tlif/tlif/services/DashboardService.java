package com.tlif.tlif.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tlif.tlif.dto.DashboardDto;
import com.tlif.tlif.entity.Applicant;
import com.tlif.tlif.entity.Grantee;
import com.tlif.tlif.entity.Receipt;
import com.tlif.tlif.entity.Receipt.ReceiptStatus;
import com.tlif.tlif.repositories.ApplicantRepository;
import com.tlif.tlif.repositories.GranteeRepository;
import com.tlif.tlif.repositories.ProgressReportRepository;
import com.tlif.tlif.repositories.ReceiptRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ApplicantRepository applicantRepository;
    private final GranteeRepository granteeRepository;
    private final ReceiptRepository receiptRepository;
    private final ProgressReportRepository progressReportRepository;

    public DashboardDto.KpiSummary getKpiSummary() {
    List<Applicant> applicants = applicantRepository.findAll();

    int totalApplications = applicants.size();
    int totalSelected = (int) applicants.stream()
        .filter(a -> a.getStatus() == Applicant.ApplicationStatus.SELECTED)
        .count();
    int totalRejected = (int) applicants.stream()
        .filter(a -> a.getStatus() == Applicant.ApplicationStatus.REJECTED)
        .count();

    List<Grantee> grantees = granteeRepository.findAll();

    long totalAllocatedBudget = grantees.stream()
        .mapToLong(g -> g.getAmountAllocated() == null ? 0L : g.getAmountAllocated())
        .sum();

    // For spent, sum approved amounts across receipts (use amountApproved when present, else 0)
    long totalSpentBudget = 0L;
    List<DashboardDto.GranteeUtilization> granteeUtilizations = grantees.stream().map(g -> {
        List<Receipt> receipts = receiptRepository.findByGranteeId(g.getId());
        long spent = receipts.stream()
            .mapToLong(r -> r.getAmountApproved() == null ? 0L : r.getAmountApproved())
            .sum();
        long allocated = g.getAmountAllocated() == null ? 0L : g.getAmountAllocated();
        int percent = allocated == 0L ? 0 : (int) ((spent * 100) / allocated);
        return DashboardDto.GranteeUtilization.builder()
            .granteeId(g.getId())
            .name(g.getName())
            .spent(spent)
            .allocated(allocated)
            .percent(percent)
            .build();
    }).collect(Collectors.toList());

    totalSpentBudget = granteeUtilizations.stream().mapToLong(gu -> gu.getSpent()).sum();

    int overallUtilizationPercent = totalAllocatedBudget == 0L ? 0 : (int) ((totalSpentBudget * 100) / totalAllocatedBudget);

    long totalPendingReceipts = receiptRepository.findByStatus(ReceiptStatus.PENDING).size();

    int lowUtilizationCount = (int) granteeUtilizations.stream().filter(g -> g.getPercent() < 50).count();

    List<DashboardDto.ReportStatusItem> reportStatusItems = progressReportRepository.findAll().stream()
        .map(r -> DashboardDto.ReportStatusItem.builder()
            .granteeId(r.getGrantee() != null ? r.getGrantee().getId() : null)
            .granteeName(r.getGrantee() != null ? r.getGrantee().getName() : null)
            .quarter(r.getQuarter())
            .dueDate(r.getDueDate() != null ? r.getDueDate().toString() : null)
            .submittedDate(r.getSubmittedDate() != null ? r.getSubmittedDate().toString() : null)
            .status(r.getStatus() != null ? r.getStatus().name() : null)
            .build())
        .collect(Collectors.toList());

    return DashboardDto.KpiSummary.builder()
        .totalApplications(totalApplications)
        .totalSelected(totalSelected)
        .totalRejected(totalRejected)
        .totalAllocatedBudget(totalAllocatedBudget)
        .totalSpentBudget(totalSpentBudget)
        .overallUtilizationPercent(overallUtilizationPercent)
        .totalPendingReceipts(totalPendingReceipts)
        .lowUtilizationCount(lowUtilizationCount)
        .granteeUtilizations(granteeUtilizations)
        .reportStatusItems(reportStatusItems)
        .build();
    }
}
