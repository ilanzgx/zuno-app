package com.ilanzgx.demo.modules.transaction.domain;

import com.ilanzgx.demo.modules.transaction.application.dto.CreateTransactionDto;

public interface TransactionService {
    Transaction createTransaction(CreateTransactionDto createTransactionDto);
}
