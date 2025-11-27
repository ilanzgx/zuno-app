package com.ilanzgx.demo.modules.position.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponseWithData;
import com.ilanzgx.demo.modules.position.application.dto.position.UserPositionResponse;
import com.ilanzgx.demo.modules.market.domain.MarketService;
import com.ilanzgx.demo.modules.user.application.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.position.application.mappers.PositionMapper;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionRequest;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponse;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.PositionRepository;
import com.ilanzgx.demo.modules.position.domain.PositionService;
import com.ilanzgx.demo.modules.transaction.domain.Transaction;
import com.ilanzgx.demo.modules.transaction.domain.TransactionType;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PositionServiceImpl implements PositionService {
    private final PositionRepository positionRepository;
    private final UserRepository userRepository;
    private final PositionMapper positionMapper;
    private final UserMapper userMapper;
    private final MarketService marketService;

    @Override
    public Position createPosition(PositionRequest positionRequest) {
        User userPropertyOwner = userRepository.findById(positionRequest.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Position position = Position.builder()
            .ticker(positionRequest.ticker())
            .quantity(positionRequest.quantity())
            .propertyOwner(userPropertyOwner)
            .build();

        return positionRepository.save(position);
    }

    @Override
    public PositionResponse getPosition(String id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));

        return positionMapper.toResponse(position);
    }

    @Override
    public List<PositionResponse> getAllPositions() {
        List<Position> positions = positionRepository.findAll();
        return positions.stream().map(positionMapper::toResponse).toList();
    }

    @Override
    public PositionResponse updatePosition(String id, PositionRequest positionRequest) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));

        User userPropertyOwner = userRepository.findById(positionRequest.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Position updatedPosition = Position.builder()
            .id(position.getId())
            .ticker(positionRequest.ticker())
            .quantity(positionRequest.quantity())
            .propertyOwner(userPropertyOwner)
            .build();

        positionRepository.save(updatedPosition);

        return positionMapper.toResponse(updatedPosition);
    }

    @Override
    public void deletePosition(String id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));

        positionRepository.delete(position);
    }

    @Override
    public UserPositionResponse getPositionsByUser(String userId) {
        User userPropertyOwner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Position> positions = positionRepository.findByPropertyOwner_Id(userId);

        List<PositionResponseWithData> positionDataEnriched = positions.stream()
                .map(position -> {
                    Map<String, Object> res = marketService.getMarket(position.getTicker());
                    Map<String, Object> positionData = ResponseEntity.ok(res).getBody();
                    return positionMapper.toResponseWithData(position, positionData);
                })
                .toList();

        return UserPositionResponse.builder()
                .user(userMapper.toResponse(userPropertyOwner))
                .positions(positionDataEnriched)
                .build();
    }

    @Override
    public void processTransaction(Transaction tx) {
        Position position = positionRepository.findByPropertyOwnerAndTicker(tx.getUser(), tx.getTicker())
                .orElse(Position.builder()
                        .propertyOwner(tx.getUser())
                        .ticker(tx.getTicker())
                        .quantity(0)
                        .averagePrice(BigDecimal.ZERO)
                        .build());

        if (tx.getType() == TransactionType.BUY) {
            handleBuy(position, tx);
        } else if (tx.getType() == TransactionType.SELL) {
            handleSell(position, tx);
        }

        positionRepository.save(position);
    }

    private void handleBuy(Position position, Transaction tx) {
        // Fórmula: ((QtdAtual * PreçoMedioAtual) + (QtdCompra * PreçoCompra)) / NovaQtdTotal
        BigDecimal currentTotalValue = position.getAveragePrice().multiply(new BigDecimal(position.getQuantity()));
        BigDecimal newTxValue = tx.getPrice().multiply(new BigDecimal(tx.getQuantity()));

        int newAmount = position.getQuantity() + tx.getQuantity();

        if (newAmount > 0) {
            BigDecimal newAveragePrice = currentTotalValue.add(newTxValue)
                    .divide(new BigDecimal(newAmount), 4, RoundingMode.HALF_UP);

            position.setAveragePrice(newAveragePrice);
        }

        position.setQuantity(newAmount);
    }

    private void handleSell(Position position, Transaction tx) {
        // VENDA: O Preço Médio NÃO muda (regra contábil/fiscal), apenas a quantidade diminui.
        // O lucro/prejuízo é calculado na hora da exibição ou em relatório, não na posição.
        int newAmount = position.getQuantity() - tx.getQuantity();

        if (newAmount < 0) {
            throw new RuntimeException("Venda a descoberto não permitida (Saldo insuficiente)");
        }

        position.setQuantity(newAmount);

        if (newAmount == 0) {
            position.setAveragePrice(BigDecimal.ZERO);
        }
    }
}
