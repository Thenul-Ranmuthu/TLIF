package com.tlif.tlif.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tlif.tlif.dto.GranteeDto;
import com.tlif.tlif.entity.Grantee;
import com.tlif.tlif.repositories.GranteeRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/grantees")
@RequiredArgsConstructor
public class GranteeController {

    private final GranteeRepository granteeRepository;

    @GetMapping
    public ResponseEntity<List<GranteeDto.summary>> getAllGrantees(){
        List<Grantee> list = granteeRepository.findAll();
        List<GranteeDto.summary> out = list.stream().map(g -> {
            GranteeDto.summary s = GranteeDto.summary.builder()
                    .id(g.getId())
                    .name(g.getName())
                    .faculty(g.getFaculty())
                    .email(g.getEmail())
                    .researchTitle(g.getResearchTitle())
                    .amountAllocated(g.getAmountAllocated())
                    .utilizationPercent(0)
                    .pendingReceiptsCount(0L)
                    .hasOverdueReport(false)
                    .scoreTotal(null)
                    .build();
            return s;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }
}
