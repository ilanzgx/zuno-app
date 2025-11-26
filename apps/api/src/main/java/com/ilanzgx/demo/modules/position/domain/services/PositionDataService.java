package com.ilanzgx.demo.modules.position.domain.services;

import java.util.Map;

public interface PositionDataService {
    Map<String, Object> getPositionData(String ticker);
}
