package com.tlif.tlif.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ProgressReportDto {

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class CreateRequest {
        @NotBlank private String quarter;
        @NotNull private LocalDate dueDate;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class SubmitRequest {
        @NotNull private LocalDate submittedDate;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class Response {
        private Long id;
        private Long granteeId;
        private String quarter;
        private LocalDate dueDate;
        private LocalDate submittedDate;
        private boolean isOverdue;
    }
}
