package com.ilanzgx.demo.modules.transaction.application;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.market.domain.MarketService;
import com.ilanzgx.demo.modules.position.domain.PositionService;
import com.ilanzgx.demo.modules.transaction.application.dto.CreateTransactionDto;
import com.ilanzgx.demo.modules.transaction.application.dto.TransactionResponse;
import com.ilanzgx.demo.modules.transaction.domain.Transaction;
import com.ilanzgx.demo.modules.transaction.domain.TransactionRepository;
import com.ilanzgx.demo.modules.transaction.domain.TransactionService;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PositionService positionService;
    private final MarketService marketService;

    @Override
    public Transaction createTransaction(CreateTransactionDto createTransactionDto) {
        User user = userRepository.findById(createTransactionDto.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = Transaction.builder()
            .ticker(createTransactionDto.ticker())
            .type(createTransactionDto.type())
            .quantity(createTransactionDto.quantity())
            .price(createTransactionDto.price())
            .date(createTransactionDto.date())
            .user(user)
                .build();

        this.transactionRepository.save(transaction);

        this.positionService.processTransaction(transaction);

        return transaction;
    }

    @Override
    public List<TransactionResponse> getTransactionsByUser(String userId) {
        List<Transaction> transactions = this.transactionRepository.findAllByUserId(userId);

        return transactions.stream().map(transaction -> {
            Map<String, Object> stockData = this.marketService.getSimpleStockData(transaction.getTicker());
            System.out.println(stockData);

            return TransactionResponse.builder()
                .id(transaction.getId())
                .ticker(transaction.getTicker())
                .type(transaction.getType().name())
                .quantity(transaction.getQuantity())
                .price(transaction.getPrice())
                .date(transaction.getDate())
                .stockData(stockData)
                .build();
        }).collect(Collectors.toList());
    }

}
