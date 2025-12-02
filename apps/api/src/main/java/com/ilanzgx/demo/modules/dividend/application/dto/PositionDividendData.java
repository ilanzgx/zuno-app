package com.ilanzgx.demo.modules.dividend.application.dto;

import java.util.List;
import java.util.Map;

import com.ilanzgx.demo.modules.transaction.domain.Transaction;

import lombok.Builder;

@Builder
public record PositionDividendData(
    String ticker,
    Integer quantity,
    Map<String, Object> dividendsData,
    List<Transaction> transactions
) {}
