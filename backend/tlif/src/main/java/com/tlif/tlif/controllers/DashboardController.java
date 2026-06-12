package com.tlif.tlif.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;

import com.tlif.tlif.dto.DashboardDto;
import com.tlif.tlif.services.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDto.KpiSummary> summary(){
        return ResponseEntity.ok(dashboardService.getKpiSummary());
    }
}
