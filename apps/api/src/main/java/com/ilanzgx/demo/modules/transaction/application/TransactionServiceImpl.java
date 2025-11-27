package com.ilanzgx.demo.modules.transaction.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.position.domain.services.PositionService;
import com.ilanzgx.demo.modules.transaction.application.dto.CreateTransactionDto;
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
    public List<Transaction> getTransactionsByUser(String userId) {
        return this.transactionRepository.findAllByUserId(userId);
    }

}
