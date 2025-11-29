package com.ilanzgx.demo.modules.dividend.application.dto;

import java.util.Map;

import lombok.Builder;

@Builder
public record PositionDividendData(
    String ticker,
    Integer quantity,
    Map<String, Object> dividendsData
) {}
