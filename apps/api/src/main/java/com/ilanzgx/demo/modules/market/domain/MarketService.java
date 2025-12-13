package com.ilanzgx.demo.modules.market.domain;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface MarketService {
    Map<String, Object> getSimpleStockData(String ticker);

    Map<String, Object> getFullStockData(String ticker);

    Map<String, Object> getStockDividendsData(String ticker, String fromDate);

    Map<String, Object> getPriceOnDate(String ticker, String date);

    Map<String, Object> getCurrentPrice(String ticker);

    Map<String, Object> getStockNews(String ticker);

    List<Map<String, Object>> getStockHistory(String ticker);

    Map<String, List<Map<String, Object>>> getStockHistoryForTickers(Set<String> tickers);
}

