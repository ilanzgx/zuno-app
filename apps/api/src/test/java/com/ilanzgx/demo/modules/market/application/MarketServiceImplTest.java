package com.ilanzgx.demo.modules.market.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import com.ilanzgx.demo.modules.shared.domain.HttpFetch;

@ExtendWith(MockitoExtension.class)
class MarketServiceImplTest {

    @Mock
    private HttpFetch httpFetch;

    private MarketServiceImpl marketService;

    @BeforeEach
    void setUp() {
        marketService = new MarketServiceImpl(httpFetch);
        ReflectionTestUtils.setField(marketService, "apiUrl", "https://brapi.dev");
        ReflectionTestUtils.setField(marketService, "apiToken", "test-token");
        ReflectionTestUtils.setField(marketService, "marketMicroserviceUrl", "http://localhost:8000");
    }

    @Test
    void shouldReturnSimpleStockDataSuccessfully() {
        Map<String, Object> mockResponse = Map.of("results", List.of(Map.of("symbol", "PETR4", "regularMarketPrice", 35.50)));
        when(httpFetch.get(eq("https://brapi.dev/api/quote/PETR4"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(mockResponse));

        Map<String, Object> result = marketService.getSimpleStockData("PETR4");

        assertThat(result).isNotNull();
        assertThat(result.get("results")).isEqualTo(mockResponse.get("results"));
    }

    @Test
    void shouldHandleErrorInSimpleStockDataGracefully() {
        when(httpFetch.get(eq("https://brapi.dev/api/quote/INVALID"), any(), eq(Map.class)))
                .thenThrow(new RuntimeException("API connection refused"));

        Map<String, Object> result = marketService.getSimpleStockData("INVALID");

        assertThat(result).containsEntry("error", true);
        assertThat(result).containsEntry("ticker", "INVALID");
    }

    @Test
    void shouldFetchBulkStockDataConcurrentlyWithVirtualThreads() {
        Map<String, Object> petrResponse = Map.of("results", List.of(Map.of("symbol", "PETR4", "regularMarketPrice", 38.00)));
        Map<String, Object> valeResponse = Map.of("results", List.of(Map.of("symbol", "VALE3", "regularMarketPrice", 62.00)));

        when(httpFetch.get(eq("https://brapi.dev/api/quote/PETR4"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(petrResponse));
        when(httpFetch.get(eq("https://brapi.dev/api/quote/VALE3"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(valeResponse));

        Map<String, Map<String, Object>> bulkResult = marketService.getBulkStockData(Set.of("PETR4", "VALE3"));

        assertThat(bulkResult).hasSize(2);
        assertThat(bulkResult.get("PETR4")).containsEntry("symbol", "PETR4");
        assertThat(bulkResult.get("VALE3")).containsEntry("symbol", "VALE3");
    }

    @Test
    void shouldHandlePartialFailureInBulkStockDataGracefully() {
        Map<String, Object> petrResponse = Map.of("results", List.of(Map.of("symbol", "PETR4", "regularMarketPrice", 38.00)));

        when(httpFetch.get(eq("https://brapi.dev/api/quote/PETR4"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(petrResponse));
        when(httpFetch.get(eq("https://brapi.dev/api/quote/FAIL"), any(), eq(Map.class)))
                .thenThrow(new RuntimeException("HTTP 500"));

        Map<String, Map<String, Object>> bulkResult = marketService.getBulkStockData(Set.of("PETR4", "FAIL"));

        assertThat(bulkResult).hasSize(1);
        assertThat(bulkResult).containsKey("PETR4");
        assertThat(bulkResult).doesNotContainKey("FAIL");
    }

    @Test
    void shouldReturnEmptyMapForNullOrEmptyBulkStockData() {
        assertThat(marketService.getBulkStockData(null)).isEmpty();
        assertThat(marketService.getBulkStockData(Set.of())).isEmpty();
    }

    @Test
    void shouldFetchStockDividendsData() {
        Map<String, Object> mockDividends = Map.of("dividends", List.of(Map.of("rate", 1.25, "paymentDate", "2024-05-10")));
        when(httpFetch.get(eq("http://localhost:8000/b3/dividends/PETR4?from_date=01/01/2024"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(mockDividends));

        Map<String, Object> result = marketService.getStockDividendsData("PETR4", "01/01/2024");

        assertThat(result).isEqualTo(mockDividends);
    }

    @Test
    void shouldFetchPriceOnDate() {
        Map<String, Object> mockPrice = Map.of("ticker", "PETR4", "close", 32.50);
        when(httpFetch.get(eq("http://localhost:8000/b3/quote/PETR4?date=2024-01-15"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(mockPrice));

        Map<String, Object> result = marketService.getPriceOnDate("PETR4", "2024-01-15");

        assertThat(result).containsEntry("close", 32.50);
    }

    @Test
    void shouldFetchCurrentPrice() {
        Map<String, Object> mockCurrent = Map.of("ticker", "VALE3", "price", 65.00);
        when(httpFetch.get(eq("http://localhost:8000/b3/quote/VALE3"), any(), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(mockCurrent));

        Map<String, Object> result = marketService.getCurrentPrice("VALE3");

        assertThat(result).containsEntry("price", 65.00);
    }

    @Test
    void shouldFetchStockHistoryForMultipleTickers() {
        Map<String, Object> mockHistories = Map.of(
                "histories", List.of(
                        Map.of("ticker", "PETR4", "history", List.of(Map.of("date", "2024-01", "close", 35.0))),
                        Map.of("ticker", "VALE3", "history", List.of(Map.of("date", "2024-01", "close", 60.0)))
                )
        );
        when(httpFetch.get(anyString(), any(), eq(Map.class))).thenReturn(ResponseEntity.ok(mockHistories));

        Map<String, List<Map<String, Object>>> result = marketService.getStockHistoryForTickers(Set.of("PETR4", "VALE3"));

        assertThat(result).hasSize(2);
        assertThat(result.get("PETR4")).hasSize(1);
        assertThat(result.get("VALE3")).hasSize(1);
    }
}
