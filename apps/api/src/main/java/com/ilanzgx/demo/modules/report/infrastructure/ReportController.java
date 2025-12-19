package com.ilanzgx.demo.modules.report.infrastructure;

import com.ilanzgx.demo.modules.report.domain.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/report")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<byte[]> getPortfolioReport(@PathVariable String userId) {
        byte[] pdfInBytes = reportService.generatePortfolioReport(userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=zuno_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfInBytes);
    }
}
