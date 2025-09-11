package com.ilanzgx.demo.modules.stock.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, String> {
  List<Stock> findByPropertyOwner_Id(String userId);
}
