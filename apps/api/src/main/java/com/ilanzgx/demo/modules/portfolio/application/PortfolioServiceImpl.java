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
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final int HISTORY_MONTHS = 12;

    private final PositionRepository positionRepository;
    private final MarketService marketService;
    private final TransactionRepository transactionRepository;

    /**
     * @brief Retorna o resumo do portfólio
     *
     * 1. Busca todas as posições do usuário
     * 2. Busca as cotações ativas (maior que 0 a quantidade) do usuário
     * 3. Calcula o saldo bruto (valor atual * quantidade) e o saldo aplicado (preço médio * quantidade)
     * 4. Calcula o lucro ou perda (saldo bruto - saldo aplicado)
     * 5. Calcula a porcentagem de lucro ou perda (lucro / saldo aplicado * 100)
     * 6. Calcula a alocação de ativos (saldo bruto por tipo de ativo)
     * 7. Retorna o resumo do portfólio
     *
     * @param userId ID do usuário
     * @return PortfolioSummaryResponse
     */
    @Override
    public PortfolioSummaryResponse getSummary(String userId) {
        List<Position> positions = positionRepository.findByPropertyOwner_Id(userId);

        // Filtra posições com quantidade > 0
        List<Position> activePositions = positions.stream()
                .filter(pos -> pos.getQuantity() > 0)
                .collect(Collectors.toList());

        if (activePositions.isEmpty()) {
            return PortfolioSummaryResponse.builder()
                    .grossBalance(BigDecimal.ZERO)
                    .appliedBalance(BigDecimal.ZERO)
                    .profitOrLoss(BigDecimal.ZERO)
                    .percentageProfit(0.0)
                    .allocation(List.of())
                    .build();
        }

        // Busca cotações de TODOS os tickers em UMA única chamada HTTP
        Set<String> tickers = activePositions.stream()
                .map(Position::getTicker)
                .collect(Collectors.toSet());
        Map<String, Map<String, Object>> bulkData = marketService.getBulkStockData(tickers);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalApplied = BigDecimal.ZERO;
        Map<String, BigDecimal> allocationMap = new HashMap<>();

        for (Position pos : activePositions) {
            BigDecimal investedInPosition = pos.getAveragePrice()
                    .multiply(new BigDecimal(pos.getQuantity()));
            totalApplied = totalApplied.add(investedInPosition);

            BigDecimal currentPrice = extractCurrentPrice(bulkData, pos);

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

    /**
     * @brief Retorna o histórico do portfólio
     *
     * 1. Busca todas as transações do usuário
     * 2. Busca as cotações de todos os tickers em uma única chamada HTTP
     * 3. Cria as variaveis monthDates e monthKeys para armazenar as datas e as chaves de cada mês
     * 4. Cria a variavel txByTicker para agrupar as transações por ticker
     * 5. Cria a variavel qtyByTickerAndMonth para armazenar a quantidade de cada ticker por mês
     * 6. Cria a variavel priceIndex para armazenar o índice de preço de cada ticker por mês
     * 7. Cria a variavel monthlyHistory para armazenar o histórico mensal
     * 8. Retorna o histórico mensal
     *
     * @param userId ID do usuário
     * @return List<PortfolioHistoryResponse>
     */
    @Override
    public List<PortfolioHistoryResponse> getHistory(String userId) {
        List<Transaction> transactions = transactionRepository.findAllByUserId(userId);
        if (transactions.isEmpty()) return List.of();

        Set<String> tickers = transactions.stream()
                .map(Transaction::getTicker)
                .collect(Collectors.toSet());

        Map<String, List<Map<String, Object>>> pricesMap = marketService.getStockHistoryForTickers(tickers);

        List<LocalDate> monthDates = buildMonthDates();
        List<String> monthKeys = buildMonthKeys(monthDates);

        Map<String, List<Transaction>> txByTicker = groupTransactionsByTicker(transactions);
        Map<String, Map<String, Integer>> qtyByTickerAndMonth = buildCumulativeQuantities(tickers, txByTicker, monthKeys);
        Map<String, Map<String, BigDecimal>> priceIndex = buildPriceIndex(tickers, pricesMap);

        return buildMonthlyHistory(monthKeys, monthDates, tickers, qtyByTickerAndMonth, priceIndex);
    }

    /**
     * @brief Gera as datas dos últimos 12 meses em ordem cronológica.
     *
     * @return List<LocalDate>
     */
    private List<LocalDate> buildMonthDates() {
        LocalDate today = LocalDate.now();
        List<LocalDate> dates = new ArrayList<>(HISTORY_MONTHS);

        for (int i = HISTORY_MONTHS - 1; i >= 0; i--) {
            dates.add(today.minusMonths(i));
        }

        return dates;
    }

    /**
     * @brief Converte as datas em chaves no formato "yyyy-MM" para uso como índice.
     *
     * @param monthDates Lista de datas de mês
     * @return List<String>
     */
    private List<String> buildMonthKeys(List<LocalDate> monthDates) {
        return monthDates.stream()
                .map(date -> date.format(MONTH_FORMATTER))
                .collect(Collectors.toList());
    }

    /**
     * @brief Agrupa todas as transações por ticker.
     *
     * @param transactions Lista de transações
     * @return Map<String, List<Transaction>>
     */
    private Map<String, List<Transaction>> groupTransactionsByTicker(List<Transaction> transactions) {
        return transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getTicker));
    }

    /**
     * @brief Calcula a quantidade acumulada de cada ticker em cada mês.
     *
     * 1. Para cada ticker, computa o delta mensal (compras - vendas) e depois
     *    acumula progressivamente ao longo dos meses.
     *
     * @param tickers Set de tickers
     * @param txByTicker Map de transações por ticker
     * @param monthKeys Lista de chaves de mês
     * @return Map de quantidade acumulada por ticker e mês
     */
    @SuppressWarnings("null")
    private Map<String, Map<String, Integer>> buildCumulativeQuantities(
            Set<String> tickers,
            Map<String, List<Transaction>> txByTicker,
            List<String> monthKeys) {

        Map<String, Map<String, Integer>> result = new HashMap<>();

        for (String ticker : tickers) {
            List<Transaction> tickerTxs = txByTicker.getOrDefault(ticker, List.of());

            Map<String, Integer> deltaByMonth = new HashMap<>();
            for (Transaction tx : tickerTxs) {
                String txMonth = tx.getDate().format(MONTH_FORMATTER);
                int delta = tx.getType() == TransactionType.BUY ? tx.getQuantity() : -tx.getQuantity();
                deltaByMonth.merge(txMonth, delta, Integer::sum);
            }

            Map<String, Integer> cumulativeQty = new HashMap<>();
            int runningTotal = 0;
            for (String monthKey : monthKeys) {
                runningTotal += deltaByMonth.getOrDefault(monthKey, 0);
                cumulativeQty.put(monthKey, runningTotal);
            }

            result.put(ticker, cumulativeQty);
        }

        return result;
    }

    /**
     * @brief Indexa os preços históricos de cada ticker em um Map<mês, preço>
     *        para permitir lookup O(1) por data.
     *
     * @param tickers Set de tickers
     * @param pricesMap Map de preços históricos por ticker
     * @return Map de preços históricos por ticker e mês
     */
    private Map<String, Map<String, BigDecimal>> buildPriceIndex(
            Set<String> tickers,
            Map<String, List<Map<String, Object>>> pricesMap) {

        Map<String, Map<String, BigDecimal>> result = new HashMap<>();

        for (String ticker : tickers) {
            Map<String, BigDecimal> tickerPrices = new HashMap<>();
            List<Map<String, Object>> historyData = pricesMap.get(ticker);

            if (historyData != null) {
                for (Map<String, Object> entry : historyData) {
                    String date = entry.get("date").toString();
                    BigDecimal close = new BigDecimal(entry.get("close").toString());
                    tickerPrices.put(date, close);
                }
            }

            result.put(ticker, tickerPrices);
        }

        return result;
    }

    /**
     * @brief Monta a lista final de histórico do portfólio.
     *
     * 1. Para cada mês, calcula o valor total da carteira somando (quantidade × preço)
     *    de todos os tickers.
     *
     * @param monthKeys Lista de chaves de mês
     * @param monthDates Lista de datas de mês
     * @param tickers Set de tickers
     * @param qtyByTickerAndMonth Map de quantidade acumulada por ticker e mês
     * @param priceIndex Map de preços históricos por ticker e mês
     * @return Lista de PortfolioHistoryResponse
     */
    private List<PortfolioHistoryResponse> buildMonthlyHistory(
            List<String> monthKeys,
            List<LocalDate> monthDates,
            Set<String> tickers,
            Map<String, Map<String, Integer>> qtyByTickerAndMonth,
            Map<String, Map<String, BigDecimal>> priceIndex) {

        List<PortfolioHistoryResponse> history = new ArrayList<>();

        for (int m = 0; m < monthKeys.size(); m++) {
            String monthKey = monthKeys.get(m);
            BigDecimal monthTotalValue = BigDecimal.ZERO;

            for (String ticker : tickers) {
                int qty = qtyByTickerAndMonth.get(ticker).getOrDefault(monthKey, 0);

                if (qty > 0) {
                    BigDecimal price = priceIndex.get(ticker).getOrDefault(monthKey, BigDecimal.ZERO);
                    monthTotalValue = monthTotalValue.add(price.multiply(new BigDecimal(qty)));
                }
            }

            history.add(new PortfolioHistoryResponse(
                    formatLabel(monthDates.get(m)),
                    monthTotalValue
            ));
        }

        return history;
    }

    /**
     * @brief Formata o mês para exibição no gráfico (ex: "Mar", "Abr").
     *
     * @param date Data do mês
     * @return String com o mês formatado
     */
    private String formatLabel(LocalDate date) {
        String month = date.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
        return month.substring(0, 1).toUpperCase() + month.substring(1);
    }

    /**
     * @brief Extrai o preço atual de mercado a partir dos dados em lote, com fallback para o preço médio.
     *
     * @param bulkData Map de dados em lote
     * @param pos Posição
     * @return Preço atual de mercado
     */
    private BigDecimal extractCurrentPrice(Map<String, Map<String, Object>> bulkData, Position pos) {
        try {
            Map<String, Object> tickerData = bulkData.get(pos.getTicker());
            if (tickerData != null) {
                Object priceObj = tickerData.get("regularMarketPrice");
                if (priceObj != null) {
                    return new BigDecimal(priceObj.toString());
                }
            }
        } catch (Exception e) {
            // fallback
        }
        return pos.getAveragePrice();
    }
}