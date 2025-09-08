package com.ilanzgx.demo.modules.stock.infrastructure.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.stock.application.StockMapper;
import com.ilanzgx.demo.modules.stock.application.StockRequest;
import com.ilanzgx.demo.modules.stock.application.StockResponse;
import com.ilanzgx.demo.modules.stock.domain.Stock;
import com.ilanzgx.demo.modules.stock.domain.StockRepository;
import com.ilanzgx.demo.modules.stock.domain.services.StockService;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final StockMapper stockMapper;

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

    @Override
    public StockResponse getStock(String id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        return stockMapper.toResponse(stock);
    }

    @Override
    public List<StockResponse> getAllStocks() {
        List<Stock> stocks = stockRepository.findAll();
        return stocks.stream().map(stockMapper::toResponse).toList();
    }

    @Override
    public StockResponse updateStock(String id, StockRequest stockRequest) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        User userPropertyOwner = userRepository.findById(stockRequest.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Stock updatedStock = Stock.builder()
            .id(stock.getId())
            .ticker(stockRequest.ticker())
            .amount(stockRequest.amount())
            .propertyOwner(userPropertyOwner)
            .build();

        stockRepository.save(updatedStock);

        return stockMapper.toResponse(updatedStock);
    }

    @Override
    public void deleteStock(String id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        stockRepository.delete(stock);
    }
}
