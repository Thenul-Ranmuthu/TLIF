package com.tlif.tlif.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tlif.tlif.dto.ApplicantDto;
import com.tlif.tlif.dto.GranteeDto;
import com.tlif.tlif.services.ApplicantService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/applicants")
@RequiredArgsConstructor
public class ApplicantController {
    
    private final ApplicantService applicantService;

    @GetMapping
    public ResponseEntity<List<ApplicantDto.Summary>> getAllApplicants(){
        return ResponseEntity.ok(applicantService.getAllApplicants());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicantDto.Response> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid ApplicantDto.UpdateStatusRequest request){
        return ResponseEntity.ok(applicantService.updateStatus(id, request));
    }
    
    @PostMapping("{id}/promote")
    public ResponseEntity<?> promoteToGrantee(
        @PathVariable Long id,
        @RequestBody(required = false) PromoteRequest body){

            Long amountAllocated = (body != null) ? body.getAmountAllocated() : null;

            try{
                GranteeDto.Response grantee = applicantService.promoteToGrantee(id, amountAllocated);
                return ResponseEntity.status(HttpStatus.CREATED).body(grantee);
            }catch(IllegalStateException ex){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorBody(ex.getMessage()));
            }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PromoteRequest{
        private Long amountAllocated;
    }

    @Getter
    @AllArgsConstructor
    public static class ErrorBody{
        private String message;
    }
}
