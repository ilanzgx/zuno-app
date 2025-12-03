package com.ilanzgx.demo.modules.market.infrastructure;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.market.domain.MarketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/market")
@RequiredArgsConstructor
public class MarketController {
    private final MarketService marketService;

    @GetMapping("/quote/{ticker}/history")
    public ResponseEntity<Map<String, Object>> getPriceOnDate(
            @PathVariable String ticker,
            @RequestParam String date) {

        Map<String, Object> data = marketService.getPriceOnDate(ticker, date);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/quote/{ticker}")
    public ResponseEntity<Map<String, Object>> getCurrentQuote(@PathVariable String ticker) {
        return ResponseEntity.ok(marketService.getCurrentPrice(ticker));
    }

    @GetMapping("/news/{ticker}")
    public ResponseEntity<Map<String, Object>> getNews(@PathVariable String ticker) {
        return ResponseEntity.ok(marketService.getStockNews(ticker));
    }
}
