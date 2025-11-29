package com.ilanzgx.demo.modules.dividend.application;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.dividend.application.dto.PositionDividendData;
import com.ilanzgx.demo.modules.dividend.application.dto.UserDividendsResponse;
import com.ilanzgx.demo.modules.dividend.domain.DividendService;
import com.ilanzgx.demo.modules.market.domain.MarketService;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.PositionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DividendServiceImpl implements DividendService {
    private final PositionRepository positionRepository;
    private final MarketService marketService;

    @Override
    public UserDividendsResponse getAllUserDividends(String userId) {
        List<Position> positions = positionRepository.findByPropertyOwner_Id(userId);

        List<PositionDividendData> dividendsData = positions.stream()
            .filter(position -> position.getQuantity() > 0)
            .map(position -> {
                Map<String, Object> dividendsInfo = marketService.getStockDividendsData(position.getTicker());

                return PositionDividendData.builder()
                    .ticker(position.getTicker())
                    .quantity(position.getQuantity())
                    .dividendsData(dividendsInfo)
                    .build();
            })
            .collect(Collectors.toList());

        return UserDividendsResponse.builder()
            .userId(userId)
            .dividends(dividendsData)
            .build();
    }
}
