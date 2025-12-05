package com.ilanzgx.demo.modules.portfolio.infrastructure;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioHistoryResponse;
import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioSummaryResponse;
import com.ilanzgx.demo.modules.portfolio.domain.PortfolioService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/v1/portfolio")
@RequiredArgsConstructor
public class PortfolioController {
    private final PortfolioService portfolioService;

    @GetMapping("/summary/{userId}")
    public ResponseEntity<PortfolioSummaryResponse> getSummary(@PathVariable String userId) {
        return ResponseEntity.ok(portfolioService.getSummary(userId));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PortfolioHistoryResponse>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(portfolioService.getHistory(userId));
    }
}
