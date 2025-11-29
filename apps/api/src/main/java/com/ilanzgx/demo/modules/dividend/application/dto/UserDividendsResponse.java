package com.ilanzgx.demo.modules.dividend.application.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record UserDividendsResponse(
    String userId,
    List<PositionDividendData> dividends
) {}
