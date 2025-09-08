package com.ilanzgx.demo.modules.stock.infrastructure;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.stock.application.StockRequest;
import com.ilanzgx.demo.modules.stock.domain.Stock;
import com.ilanzgx.demo.modules.stock.domain.StockRepository;
import com.ilanzgx.demo.modules.stock.domain.StockService;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    @Override
    public Stock createStock(StockRequest stockRequest) {
        User userPropertyOwner = userRepository.findById(stockRequest.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Stock stock = Stock.builder()
            .ticker(stockRequest.ticker())
            .amount(stockRequest.amount())
            .propertyOwner(userPropertyOwner)
            .build();

        return stockRepository.save(stock);
    }
}
