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

    @PostMapping("/generate")
    public void generateProjectReport() {
    }

    @GetMapping("/{reportId}")
    public void getProjectReport() {
    }
}
