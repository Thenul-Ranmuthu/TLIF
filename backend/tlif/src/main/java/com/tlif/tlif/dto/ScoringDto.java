package com.tlif.tlif.dto;

import java.util.List;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ScoringDto {
    
    @Getter
    @Setter 
    @Builder 
    @AllArgsConstructor 
    @NoArgsConstructor
    public static class UpdateRequest{
        @Min(1) @Max(5) private Integer alignment;
        @Min(1) @Max(5) private Integer contribution;
        @Min(1) @Max(5) private Integer innovation;
        @Min(1) @Max(5) private Integer outcomes;
        @Min(1) @Max(5) private Integer budget;
        @Min(1) @Max(5) private Integer stakeholders;
        @Min(1) @Max(5) private Integer students;
    }

     @Getter
     @Setter 
     @Builder 
     @AllArgsConstructor 
     @NoArgsConstructor
     public static class Response{
            private Long id;
            private Long applicantId;
            private String applicantName;
            private Integer alignment;
            private Integer contribution;
            private Integer innovation;
            private Integer outcomes;
            private Integer budget;
            private Integer stakeholders;
            private Integer students;
            private Integer totalScore;
            private Integer rank;
            private boolean selected;
     }

     @Getter
     @Setter 
     @Builder 
     @AllArgsConstructor 
     @NoArgsConstructor
     public static class RankedList{
        private List<Response> rankings;
        private int selectionThreshold;   // top N are "selected"
     }
}
