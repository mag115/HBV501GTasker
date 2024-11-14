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
    public ResponseEntity<ProjectReport> generateProjectReport() {
        ProjectReport report = projectReportService.generateProjectReport();
        return ResponseEntity.ok(report);  // Return the generated report in the response
    }

    @PostMapping("/generate/custom")
    public ResponseEntity<ProjectReport> generateCustomProjectReport(@RequestBody ReportOptions options) {
        ProjectReport report = projectReportService.generateCustomProjectReport(options);
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

    @GetMapping("/{projectId}/export")
    public ResponseEntity<byte[]> exportProjectReport(@PathVariable Long projectId) throws IOException {
        ProjectReport report = projectReportService.getReportById(projectId);

        if (report == null) {
            return ResponseEntity.notFound().build();
        }

        // Create a PDF document
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
                contentStream.showText("Date: " + report.getReportDate().toString());
                contentStream.newLine();
                contentStream.showText("Total Time Spent: " + report.getTotalTimeSpent() + " hours");
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

        // Return the PDF as a downloadable file
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=project_report_" + projectId + ".pdf")
                .body(pdfBytes);
    }
}
