package com.ilanzgx.demo.modules.stock.infrastructure;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.stock.application.StockMapper;
import com.ilanzgx.demo.modules.stock.application.StockRequest;
import com.ilanzgx.demo.modules.stock.application.StockResponse;
import com.ilanzgx.demo.modules.stock.domain.Stock;
import com.ilanzgx.demo.modules.stock.domain.StockService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/stocks")
@RequiredArgsConstructor
public class StockController {
    private final StockService stockService;
    private final StockMapper stockMapper;

    @PostMapping
    public StockResponse createStock(@RequestBody StockRequest stockRequest) {
        Stock stock = this.stockService.createStock(stockRequest);
        return stockMapper.toResponse(stock);
    }
}
