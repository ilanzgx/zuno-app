package com.ilanzgx.demo.modules.transaction.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findAllByUserId(String userId);
}
