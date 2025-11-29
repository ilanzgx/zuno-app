package com.ilanzgx.demo.modules.portfolio.domain;

import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioSummaryResponse;

public interface PortfolioService {
    public PortfolioSummaryResponse getSummary(String userId);
}
