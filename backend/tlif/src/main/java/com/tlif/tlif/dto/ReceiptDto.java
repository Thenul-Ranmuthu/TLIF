package com.tlif.tlif.dto;

import java.time.LocalDate;

import com.tlif.tlif.entity.Receipt.ReceiptStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ReceiptDto {

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class CreateRequest {
        @NotBlank private String categoryName;
        @NotBlank private String description;
        @Positive private Long amountClaimed;
        private LocalDate uploadedDate;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class UpdateStatusRequest {
        private ReceiptStatus status;
        private Long amountApproved;
        private String comment;
        private String approvedBy;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class Response {
        private Long id;
        private String receiptCode;
        private Long granteeId;
        private String categoryName;
        private String description;
        private Long amountClaimed;
        private ReceiptStatus status;
        private Long amountApproved;
        private LocalDate uploadedDate;
        private String approvedBy;
        private String comment;
    }
}
