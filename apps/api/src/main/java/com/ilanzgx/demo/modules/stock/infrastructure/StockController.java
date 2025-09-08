package com.ilanzgx.demo.modules.stock.infrastructure;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/{id}")
    public StockResponse getStock(@PathVariable String id) {
        return this.stockService.getStock(id);
    }

    @GetMapping
    public List<StockResponse> getAllStocks() {
        return this.stockService.getAllStocks();
    }

    @PutMapping("/{id}")
    public StockResponse updateStock(@PathVariable String id, @RequestBody StockRequest stockRequest) {
        return this.stockService.updateStock(id, stockRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteStock(@PathVariable String id) {
        this.stockService.deleteStock(id);
    }
}
