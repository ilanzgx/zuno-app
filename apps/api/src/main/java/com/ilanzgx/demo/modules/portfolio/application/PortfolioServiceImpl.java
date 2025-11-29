package com.ilanzgx.demo.modules.portfolio.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.market.domain.MarketService;
import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioSummaryResponse;
import com.ilanzgx.demo.modules.portfolio.domain.PortfolioService;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.PositionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {
    private final PositionRepository positionRepository;
    private final MarketService marketService;

    @Override
    public PortfolioSummaryResponse getSummary(String userId) {
        List<Position> positions = positionRepository.findByPropertyOwner_Id(userId);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalApplied = BigDecimal.ZERO;

        Map<String, BigDecimal> allocationMap = new HashMap<>();

        for (Position pos : positions) {
            if (pos.getQuantity() <= 0) continue;

            BigDecimal investedInPosition = pos.getAveragePrice()
                .multiply(new BigDecimal(pos.getQuantity()));
            totalApplied = totalApplied.add(investedInPosition);

            Map<String, Object> marketData = marketService.getSimpleStockData(pos.getTicker());

            BigDecimal currentPrice;
            try {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> results = (List<Map<String, Object>>) marketData.get("results");

                if (results != null && !results.isEmpty()) {
                    Map<String, Object> firstResult = results.get(0);
                    Object priceObj = firstResult.get("regularMarketPrice");

                    if (priceObj != null) {
                        currentPrice = new BigDecimal(priceObj.toString());
                    } else {
                        currentPrice = pos.getAveragePrice();
                    }
                } else {
                    currentPrice = pos.getAveragePrice();
                }
            } catch (Exception e) {
                currentPrice = pos.getAveragePrice();
            }

            BigDecimal valueInPosition = currentPrice.multiply(new BigDecimal(pos.getQuantity()));
            totalGross = totalGross.add(valueInPosition);

            String typeName = pos.getAssetType() != null ? pos.getAssetType().toString() : "OUTROS";

            allocationMap.merge(typeName, valueInPosition, BigDecimal::add);
        }

        BigDecimal profit = totalGross.subtract(totalApplied);
        Double percentage = 0.0;

        if (totalApplied.compareTo(BigDecimal.ZERO) > 0) {
            percentage = profit.divide(totalApplied, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(100))
                .doubleValue();
        }

        List<PortfolioSummaryResponse.AllocationItem> allocation = new ArrayList<>();

        if (totalGross.compareTo(BigDecimal.ZERO) > 0) {
            for (Map.Entry<String, BigDecimal> entry : allocationMap.entrySet()) {
                Double typePercentage = entry.getValue()
                    .divide(totalGross, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100))
                    .doubleValue();

                allocation.add(new PortfolioSummaryResponse.AllocationItem(
                    entry.getKey(),
                    entry.getValue(),
                    typePercentage
                ));
            }
        }

        return PortfolioSummaryResponse.builder()
            .grossBalance(totalGross)
            .appliedBalance(totalApplied)
            .profitOrLoss(profit)
            .percentageProfit(percentage)
            .allocation(allocation)
            .build();
    }
}