package com.ilanzgx.demo.modules.portfolio.application.dto;

import java.math.BigDecimal;

import lombok.Builder;

@Builder
public record PortfolioHistoryResponse(
    String label,
    BigDecimal value
) {}
