package com.ilanzgx.demo.modules.dividend.infrastructure;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ilanzgx.demo.modules.dividend.application.dto.UserDividendsResponse;
import com.ilanzgx.demo.modules.dividend.domain.DividendService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/dividends")
@RequiredArgsConstructor
public class DividendController {
    private final DividendService dividendService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDividendsResponse> getAllUserDividends(@PathVariable String userId) {
        UserDividendsResponse response = dividendService.getAllUserDividends(userId);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }
}
