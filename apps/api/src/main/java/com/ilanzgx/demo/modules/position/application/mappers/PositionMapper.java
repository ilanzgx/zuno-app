package com.ilanzgx.demo.modules.position.application.mappers;

import com.ilanzgx.demo.modules.position.application.dto.position.*;
import com.ilanzgx.demo.modules.user.application.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.user.domain.User;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PositionMapper {
    private final UserMapper userMapper;

    public Position toEntity(PositionRequest positionRequest, User propertyOwner) {
        return Position.builder()
            .ticker(positionRequest.ticker())
            .quantity(positionRequest.quantity())
            .propertyOwner(propertyOwner)
            .build();
    }

    public PositionResponse toResponse(Position position) {
        return PositionResponse.builder()
            .id(position.getId())
            .ticker(position.getTicker())
            .quantity(position.getQuantity())
            .user(userMapper.toResponse(position.getPropertyOwner()))
            .build();
    }

    public PositionResponseWithoutUser toResponseWithoutUser(Position position) {
        return PositionResponseWithoutUser.builder().id(position.getId()).ticker(position.getTicker()).quantity(position.getQuantity()).build();
    }

    /*
    public UserPositionResponse toResponse(User user, List<Position> positions, List<ResponseEntity<Object>> positionData) {
        List<PositionResponseWithoutUser> positionResponseWithoutUsers = positions.stream().map(this::toResponseWithoutUser).toList();

        return UserPositionResponse.builder()
                .user(userMapper.toResponse(user))
                .positions(positionResponseWithoutUsers)
                .positionData(positionData)
                .build();
    }*/

    public PositionResponseWithData toResponseWithData(Position position, Map<String, Object> positionData) {
        return PositionResponseWithData.builder()
                .id(position.getId())
                .ticker(position.getTicker())
                .quantity(position.getQuantity())
                .positionData(positionData)
                .build();
    }
}
