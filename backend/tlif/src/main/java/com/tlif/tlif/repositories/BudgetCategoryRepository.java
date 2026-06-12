package com.tlif.tlif.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tlif.tlif.entity.BudgetCategory;
import java.util.List;


public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Long>{
    
    List<BudgetCategory> findByGranteeId(Long granteeId);
}
