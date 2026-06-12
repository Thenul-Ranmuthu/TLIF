package com.tlif.tlif.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class DashboardDto {
    
    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class KpiSummary {
        private int totalApplications;
        private int totalSelected;
        private int totalRejected;
        private long totalAllocatedBudget;
        private long totalSpentBudget;
        private int overallUtilizationPercent;
        private long totalPendingReceipts;
        private int lowUtilizationCount;        // < 50%
        private List<GranteeUtilization> granteeUtilizations;
        private List<ReportStatusItem>   reportStatusItems;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class GranteeUtilization {
        private Long granteeId;
        private String name;
        private long spent;
        private long allocated;
        private int percent;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class ReportStatusItem {
        private Long granteeId;
        private String granteeName;
        private String quarter;
        private String dueDate;
        private String submittedDate;
        private String status;
    }
}
