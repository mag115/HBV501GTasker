package hi.is.tasker.controllers;

import hi.is.tasker.dto.ReportOptions;
import hi.is.tasker.entities.ProjectReport;
import hi.is.tasker.entities.Task;
import hi.is.tasker.services.ProjectReportService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ProjectReportController {

    private final ProjectReportService projectReportService;

    @Autowired
    public ProjectReportController(ProjectReportService projectReportService) {
        this.projectReportService = projectReportService;
    }

    @GetMapping()
    public ResponseEntity<List<ProjectReport>> getAllReports() {
        List<ProjectReport> reports = projectReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/generate")
    public ResponseEntity<ProjectReport> generateProjectReport(@RequestParam Long projectId) {
        ProjectReport report = projectReportService.generateProjectReport(projectId);
        return ResponseEntity.ok(report);
    }


    @PostMapping("/generate/custom")
    public ResponseEntity<ProjectReport> generateCustomProjectReport(@RequestParam Long projectId, @RequestBody ReportOptions options) {
        ProjectReport report = projectReportService.generateCustomProjectReport(projectId, options);
        return ResponseEntity.ok(report);
    }


    @GetMapping("/{reportId}")
    public ResponseEntity<ProjectReport> getProjectReport(@PathVariable Long reportId) {
        ProjectReport report = projectReportService.getReportById(reportId);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/{reportId}/export")
    public ResponseEntity<byte[]> exportProjectReport(@PathVariable Long reportId) throws IOException {
        ProjectReport report = projectReportService.getReportById(reportId);

        if (report == null) {
            return ResponseEntity.notFound().build();
        }

        LocalDateTime reportDate = report.getReportDate();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = reportDate.format(dateFormatter);

        //PDF document
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.setLeading(20f);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Project Report");
                contentStream.newLine();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("Report ID: " + report.getId());
                contentStream.newLine();
                contentStream.showText("Date Of Report: " + formattedDate);
                contentStream.newLine();
                contentStream.newLine();
                contentStream.showText("Overall Performance: " + report.getOverallPerformance());
                contentStream.newLine();
                contentStream.newLine();
                contentStream.showText("Tasks:");
                contentStream.newLine();
                for (Task task : report.getTasks()) {
                    contentStream.showText(" - " + task.getTitle() + " (" + task.getStatus() + ")");
                    contentStream.newLine();
                }

                contentStream.endText();
            }

            document.save(outputStream);
        }

        byte[] pdfBytes = outputStream.toByteArray();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=project_report_" + reportId + ".pdf")
                .body(pdfBytes);
    }
}
