package com.ilanzgx.demo.modules.report.application;

import com.ilanzgx.demo.modules.portfolio.domain.PortfolioService;
import com.ilanzgx.demo.modules.report.domain.ReportService;
import com.ilanzgx.demo.modules.user.domain.User;
import com.ilanzgx.demo.modules.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportServiceImpl implements ReportService {
    private final PortfolioService portfolioService;
    private final UserRepository userRepository;

    public byte[] generatePortfolioReport(String userId) {
        try {
            User user = this.userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            var summary = portfolioService.getSummary(userId);

            InputStream reportStream = new ClassPathResource("reports/portfolio.jrxml").getInputStream();

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("USER_NAME", user.getName());
            parameters.put("GROSS_BALANCE", summary.grossBalance());
            parameters.put("APPLIED_TOTAL", summary.appliedBalance());
            parameters.put("PROFIT_PERCENT", summary.profitOrLoss());

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            log.error("Erro ao gerar relatório: " + e.getMessage());
            throw new RuntimeException("Erro ao gerar relatório: " + e.getMessage());
        }
    }
}
