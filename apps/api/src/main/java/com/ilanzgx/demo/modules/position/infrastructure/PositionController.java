package com.ilanzgx.demo.modules.position.infrastructure;

import java.util.List;
import java.util.Map;

import com.ilanzgx.demo.modules.position.application.dto.position.UserPositionResponse;
import com.ilanzgx.demo.modules.position.domain.services.PositionDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.position.application.mappers.PositionMapper;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionRequest;
import com.ilanzgx.demo.modules.position.application.dto.position.PositionResponse;
import com.ilanzgx.demo.modules.position.domain.Position;
import com.ilanzgx.demo.modules.position.domain.services.PositionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/positions")
@RequiredArgsConstructor
public class PositionController {
    private final PositionService positionService;
    private final PositionDataService positionDataService;
    private final PositionMapper positionMapper;

    @PostMapping
    public PositionResponse createPosition(@RequestBody PositionRequest positionRequest) {
        Position position = this.positionService.createPosition(positionRequest);
        return positionMapper.toResponse(position);
    }

    @GetMapping("/{id}")
    public PositionResponse getPosition(@PathVariable String id) {
        return this.positionService.getPosition(id);
    }

    @GetMapping
    public List<PositionResponse> getAllPositions() {
        return this.positionService.getAllPositions();
    }

    @PutMapping("/{id}")
    public PositionResponse updatePosition(@PathVariable String id, @RequestBody PositionRequest positionRequest) {
        return this.positionService.updatePosition(id, positionRequest);
    }

    @DeleteMapping("/{id}")
    public void deletePosition(@PathVariable String id) {
        this.positionService.deletePosition(id);
    }

    @GetMapping("/user/{userId}")
    public UserPositionResponse getPositionsByUser(@PathVariable String userId) {
        return this.positionService.getPositionsByUser(userId);
    }

    @GetMapping("/data/{ticker}")
    public ResponseEntity<Map<String, Object>> getPositionData(@PathVariable String ticker) {
        Map<String, Object> positionData = this.positionDataService.getPositionData(ticker);
        return ResponseEntity.ok(positionData);
    }
}
