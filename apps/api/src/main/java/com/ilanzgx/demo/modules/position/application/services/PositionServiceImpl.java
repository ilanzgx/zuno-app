package com.ilanzgx.demo.modules.position.application.services;

import java.util.List;
import java.util.Map;

import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponseWithData;
import com.ilanzgx.demo.modules.position.application.dto.position.UserPositionResponse;
import com.ilanzgx.demo.modules.position.domain.services.PositionDataService;
import com.ilanzgx.demo.modules.user.application.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ilanzgx.demo.modules.position.application.mappers.PositionMapper;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionRequest;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponse;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.PositionRepository;
import com.ilanzgx.demo.modules.position.domain.services.PositionService;
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
    private final PositionDataService positionDataService;

    @Override
    public Position createPosition(PositionRequest positionRequest) {
        User userPropertyOwner = userRepository.findById(positionRequest.userId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Position position = Position.builder()
            .ticker(positionRequest.ticker())
            .amount(positionRequest.amount())
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
            .amount(positionRequest.amount())
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
                Map<String, Object> res = positionDataService.getPositionData(position.getTicker());
                Map<String, Object> positionData = ResponseEntity.ok(res).getBody();
                return positionMapper.toResponseWithData(position, positionData);
            })
            .toList();

        return UserPositionResponse.builder()
                .user(userMapper.toResponse(userPropertyOwner))
                .positions(positionDataEnriched)
                .build();
    }
}
