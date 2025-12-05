package com.ilanzgx.demo.modules.portfolio.domain;

import java.util.List;

import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioHistoryResponse;
import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioSummaryResponse;

public interface PortfolioService {
    public PortfolioSummaryResponse getSummary(String userId);

    public List<PortfolioHistoryResponse> getHistory(String userId);
}
