package hi.is.tasker.controllers;

import hi.is.tasker.entities.ProjectReport;
import hi.is.tasker.services.ProjectReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @GetMapping("/{reportId}")
    public ResponseEntity<ProjectReport> getProjectReport(@PathVariable Long reportId) {
        ProjectReport report = projectReportService.getReportById(reportId);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }
}
