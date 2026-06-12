package com.tlif.tlif.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tlif.tlif.entity.Receipt;
import com.tlif.tlif.entity.Receipt.ReceiptStatus;

public interface ReceiptRepository extends JpaRepository<Receipt, Long>{
    
    List<Receipt> findByGranteeId(Long granteeId);
    List<Receipt> findByStatus(ReceiptStatus status);
    long countByGranteeIdAndStatus(Long granteeId, ReceiptStatus status);
}
