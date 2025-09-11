package com.ilanzgx.demo.modules.stock.application.mappers;

import com.ilanzgx.demo.modules.stock.application.dto.stock.*;
import com.ilanzgx.demo.modules.user.application.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.ilanzgx.demo.modules.stock.domain.Stock;
import com.ilanzgx.demo.modules.user.domain.User;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class StockMapper {
    private final UserMapper userMapper;

    public Stock toEntity(StockRequest stockRequest, User propertyOwner) {
        return Stock.builder()
            .ticker(stockRequest.ticker())
            .amount(stockRequest.amount())
            .propertyOwner(propertyOwner)
            .build();
    }

    public StockResponse toResponse(Stock stock) {
        return StockResponse.builder()
            .id(stock.getId())
            .ticker(stock.getTicker())
            .amount(stock.getAmount())
            .user(userMapper.toResponse(stock.getPropertyOwner()))
            .build();
    }

    public StockResponseWithoutUser toResponseWithoutUser(Stock stock) {
        return StockResponseWithoutUser.builder().id(stock.getId()).ticker(stock.getTicker()).amount(stock.getAmount()).build();
    }

    /*
    public UserStockResponse toResponse(User user, List<Stock> stocks, List<ResponseEntity<Object>> stockData) {
        List<StockResponseWithoutUser> stockResponseWithoutUsers = stocks.stream().map(this::toResponseWithoutUser).toList();

        return UserStockResponse.builder()
                .user(userMapper.toResponse(user))
                .stocks(stockResponseWithoutUsers)
                .stockData(stockData)
                .build();
    }*/

    public StockResponseWithData toResponseWithData(Stock stock, Map<String, Object> stockData) {
        return StockResponseWithData.builder()
                .id(stock.getId())
                .ticker(stock.getTicker())
                .amount(stock.getAmount())
                .stockData(stockData)
                .build();
    }
}
