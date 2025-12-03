package com.ilanzgx.demo.modules.position.domain;

import java.util.List;
import java.util.Map;

import com.ilanzgx.demo.modules.position.application.dto.position.PositionRequest;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponse;
import com.ilanzgx.demo.modules.position.application.dto.position.UserPositionResponse;
import com.ilanzgx.demo.modules.transaction.domain.Transaction;

public interface PositionService {
    Position createPosition(PositionRequest positionRequest);
    PositionResponse getPosition(String id);
    List<PositionResponse> getAllPositions();
    PositionResponse updatePosition(String id, PositionRequest positionRequest);
    void deletePosition(String id);

    UserPositionResponse getPositionsByUser(String userId);

    void processTransaction(Transaction tx);

    Map<String, Object> getStockNewsByUserPosition(String userId);
}
