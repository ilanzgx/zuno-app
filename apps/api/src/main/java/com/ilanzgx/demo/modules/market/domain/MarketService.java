package com.ilanzgx.demo.modules.market.domain;

import java.util.Map;

public interface MarketService {
    Map<String, Object> getMarket(String ticker);
}
