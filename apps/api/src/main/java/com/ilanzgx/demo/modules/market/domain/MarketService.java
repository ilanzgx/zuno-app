package com.ilanzgx.demo.modules.market.domain;

import java.util.Map;

public interface MarketService {
    Map<String, Object> getSimpleStockData(String ticker);

    Map<String, Object> getFullStockData(String ticker);

    Map<String, Object> getStockDividendsData(String ticker);
}
