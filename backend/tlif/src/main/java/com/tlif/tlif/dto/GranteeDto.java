package com.tlif.tlif.dto;

import java.util.List;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class GranteeDto {

     @Getter 
     @Setter 
     @Builder 
     @AllArgsConstructor 
     @NoArgsConstructor
     public static class CreateRequest{
            @NotBlank private String name;
            @NotBlank private String faculty;
            @Email @NotBlank private String email;
            @NotBlank private String researchTitle;
            @Positive private Long amountAllocated;
     }

     @Getter 
     @Setter 
     @Builder 
     @AllArgsConstructor 
     @NoArgsConstructor
     public static class Response{
          private Long id;
          private String name;
          private String faculty;
          private String email;
          private String researchTitle;
          private Long amountAllocated;
          private Long totalApproved;
          private Long totalSpent;
          private Long remaining;
          private int utilizationPercent;
          private long pendingReceiptsCount;
          private boolean hasOverdueReport;
          private List<BudgetCategoryDto.Response> budgetCategories;
          private List<ReceiptDto.Response>         receipts;
          private List<ProgressReportDto.Response>  progressReports;
     }

     @Getter 
     @Setter 
     @Builder 
     @AllArgsConstructor 
     @NoArgsConstructor
     public static class summary{
          private Long id;
          private String name;
          private String faculty;
          private String email;
          private String researchTitle;
          private Long amountAllocated;
          private int utilizationPercent;
          private long pendingReceiptsCount;
          private boolean hasOverdueReport;
          private Integer scoreTotal;
     }


    
}
