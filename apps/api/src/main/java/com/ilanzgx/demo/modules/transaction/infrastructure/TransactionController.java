package com.ilanzgx.demo.modules.transaction.infrastructure;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.transaction.application.dto.CreateTransactionDto;
import com.ilanzgx.demo.modules.transaction.domain.Transaction;
import com.ilanzgx.demo.modules.transaction.domain.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping
    public Transaction createTransaction(@RequestBody CreateTransactionDto createTransactionDto) {
        System.out.println(createTransactionDto);
        return transactionService.createTransaction(createTransactionDto);
    }
}
