package com.ilanzgx.demo.modules.transaction.domain;

import java.util.List;

import com.ilanzgx.demo.modules.transaction.application.dto.CreateTransactionDto;
import com.ilanzgx.demo.modules.transaction.application.dto.TransactionResponse;

public interface TransactionService {
    Transaction createTransaction(CreateTransactionDto createTransactionDto);
    List<TransactionResponse> getTransactionsByUser(String userId);
}
