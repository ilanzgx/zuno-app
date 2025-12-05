package com.ilanzgx.demo.modules.portfolio.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.market.domain.MarketService;
import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioHistoryResponse;
import com.ilanzgx.demo.modules.portfolio.application.dto.PortfolioSummaryResponse;
import com.ilanzgx.demo.modules.portfolio.domain.PortfolioService;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.PositionRepository;
import com.ilanzgx.demo.modules.transaction.domain.Transaction;
import com.ilanzgx.demo.modules.transaction.domain.TransactionRepository;
import com.ilanzgx.demo.modules.transaction.domain.TransactionType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {
    private final PositionRepository positionRepository;
    private final MarketService marketService;
    private final TransactionRepository transactionRepository;

    @Override
    public PortfolioSummaryResponse getSummary(String userId) {
        List<Position> positions = positionRepository.findByPropertyOwner_Id(userId);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalApplied = BigDecimal.ZERO;

        Map<String, BigDecimal> allocationMap = new HashMap<>();

        for (Position pos : positions) {
            if (pos.getQuantity() <= 0)
                continue;

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
                        typePercentage));
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

    @Override
    public List<PortfolioHistoryResponse> getHistory(String userId) {
        List<Transaction> transactions = transactionRepository.findAllByUserId(userId);
        if (transactions.isEmpty()) return List.of();

        Set<String> tickers = transactions.stream().map(Transaction::getTicker).collect(Collectors.toSet());

        Map<String, List<Map<String, Object>>> pricesMap = new HashMap<>();
        for (String ticker : tickers) {
            pricesMap.put(ticker, marketService.getStockHistory(ticker));
        }

        List<PortfolioHistoryResponse> history = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 11; i >= 0; i--) {
            LocalDate targetDate = today.minusMonths(i);
            String monthKey = targetDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            BigDecimal monthTotalValue = BigDecimal.ZERO;
            for (String ticker : tickers) {
                int qtyAtDate = calculateQuantityAtDate(transactions, ticker, monthKey);

                if (qtyAtDate > 0) {
                    BigDecimal priceAtDate = findPriceForMonth(pricesMap.get(ticker), monthKey);
                    monthTotalValue = monthTotalValue.add(priceAtDate.multiply(new BigDecimal(qtyAtDate)));
                }
            }

            history.add(new PortfolioHistoryResponse(
                formatLabel(targetDate),
                monthTotalValue
            ));
        }

        return history;
    }

    // Soma todas as compras e subtrai vendas até aquela data
    private int calculateQuantityAtDate(List<Transaction> allTx, String ticker, String monthIso) {
        return allTx.stream()
            .filter(tx -> tx.getTicker().equals(ticker))
            .filter(tx -> tx.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM")).compareTo(monthIso) <= 0)
            .mapToInt(tx -> tx.getType() == TransactionType.BUY ? tx.getQuantity() : -tx.getQuantity())
            .sum();
    }

    // Encontra o preço de fechamento no JSON do Python
    private BigDecimal findPriceForMonth(List<Map<String, Object>> historyData, String monthIso) {
        if (historyData == null)
            return BigDecimal.ZERO;

        return historyData.stream()
                .filter(h -> h.get("date").toString().equals(monthIso))
                .findFirst()
                .map(h -> new BigDecimal(h.get("close").toString()))
                .orElse(BigDecimal.ZERO);
    }

    // Formata o mês para exibir no gráfico
    private String formatLabel(LocalDate date) {
        String month = date.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
        return month.substring(0, 1).toUpperCase() + month.substring(1);
    }
}