package com.tlif.tlif.dto;

import lombok.*;
import jakarta.validation.constraints.*;

import com.tlif.tlif.entity.Applicant.ApplicationStatus;

public class ApplicantDto {
    
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
        @Positive private Long amountRequested;
    }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class UpdateStatusRequest{
        @NotNull private ApplicationStatus status;
        private Long amountAllocated;
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
          private Long amountRequested;
          private ApplicationStatus status;

          public enum ApplicationStatus {
            PENDING, SELECTED, REJECTED
        }
     }

    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class Summary{
        private Long id;
        private String name;
        private String faculty;
        private String email;
        private String researchTitle;
        private Long amountRequested;
        private ApplicationStatus status;
        private Integer scoreTotal;
    }
}
