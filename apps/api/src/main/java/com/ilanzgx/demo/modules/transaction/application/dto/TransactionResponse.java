package com.ilanzgx.demo.modules.transaction.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Builder;

@Builder
public record TransactionResponse(String id, String ticker, String type, int quantity, BigDecimal price, LocalDate date, Object stockData) {}
