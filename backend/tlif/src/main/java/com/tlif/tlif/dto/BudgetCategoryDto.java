package com.tlif.tlif.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class BudgetCategoryDto {

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class CreateRequest{
        @NotBlank private String categoryName;
        @PositiveOrZero private Long amountRequested;
        @PositiveOrZero private Long amountApproved;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class Response{
        private Long id;
        private String categoryName;
        private Long amountRequested;
        private Long amountApproved;
        private Long amountSpent;
        private Long remaining;
        private int utilizationPercent;
    }

}
