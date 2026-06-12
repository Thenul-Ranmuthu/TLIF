package com.tlif.tlif.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "scoring_records")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class ScoringRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false, unique = true)
    private Applicant applicant;

    //scoring criteria
    @Column(nullable = false) @Builder.Default private Integer alignment     = 3; // weight 10%
    @Column(nullable = false) @Builder.Default private Integer contribution  = 3; // weight 15%
    @Column(nullable = false) @Builder.Default private Integer innovation    = 3; // weight 20%
    @Column(nullable = false) @Builder.Default private Integer outcomes      = 3; // weight 15%
    @Column(nullable = false) @Builder.Default private Integer budget        = 3; // weight 15%
    @Column(nullable = false) @Builder.Default private Integer stakeholders  = 3; // weight 10%
    @Column(nullable = false) @Builder.Default private Integer students      = 3; // weight 15%

    @Column(nullable = false) @Builder.Default private Integer totalScore = 0;

    private static final double[] WEIGHTS = {0.10, 0.15, 0.20, 0.15, 0.15, 0.10, 0.15};

    private void recalculate(){
        int[] s = {alignment, contribution, innovation, outcomes, budget, stakeholders, students};

        double sum = 0;

        for(int i = 0; i < s.length; i++)
            sum += s[i] * WEIGHTS[i];

        this.totalScore = (int) Math.round(sum/4*100);
    }
}
