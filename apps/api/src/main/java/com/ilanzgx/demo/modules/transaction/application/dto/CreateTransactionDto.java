package com.ilanzgx.demo.modules.transaction.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ilanzgx.demo.modules.transaction.domain.TransactionType;

import lombok.Builder;

@Builder
public record CreateTransactionDto(String ticker, TransactionType type, Integer quantity, BigDecimal price, LocalDate date, String userId) {}