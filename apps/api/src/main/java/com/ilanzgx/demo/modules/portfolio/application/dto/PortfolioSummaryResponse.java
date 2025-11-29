package com.ilanzgx.demo.modules.portfolio.application.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;

@Builder
public record PortfolioSummaryResponse(
        BigDecimal grossBalance,
        BigDecimal appliedBalance,
        BigDecimal profitOrLoss,
        Double percentageProfit,
        List<AllocationItem> allocation
) {
    @Builder
    public record AllocationItem(String type, BigDecimal value, Double percentage) {}
}
