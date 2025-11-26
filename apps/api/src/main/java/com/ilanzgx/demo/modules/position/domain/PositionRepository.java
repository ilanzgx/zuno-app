package com.ilanzgx.demo.modules.position.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ilanzgx.demo.modules.user.domain.User;

public interface PositionRepository extends JpaRepository<Position, String> {
  List<Position> findByPropertyOwner_Id(String userId);
  Optional<Position> findByPropertyOwnerAndTicker(User propertyOwner, String ticker);
}
