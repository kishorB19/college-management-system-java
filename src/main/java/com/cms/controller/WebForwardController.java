package com.cms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to handle web forwarding between /api and root web assets.
 * Ensures the web application and dashboards load seamlessly whether accessed
 * via root URL or /api paths.
 */
@Controller
public class WebForwardController {

    @GetMapping({"/api", "/api/", "/api/index.html"})
    public String forwardIndex() {
        return "forward:/index.html";
    }

    @GetMapping("/api/student-dashboard.html")
    public String forwardStudentDashboard() {
        return "forward:/student-dashboard.html";
    }

    @GetMapping("/api/teacher-dashboard.html")
    public String forwardTeacherDashboard() {
        return "forward:/teacher-dashboard.html";
    }
}
