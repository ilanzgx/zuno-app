package com.ilanzgx.demo.modules.position.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, String> {
  List<Position> findByPropertyOwner_Id(String userId);
}
