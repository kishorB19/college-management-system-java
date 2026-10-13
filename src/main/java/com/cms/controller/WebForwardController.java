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

    @GetMapping({
            "/api",
            "/api/",
            "/api/index.html",
            "/student-dashboard.html",
            "/teacher-dashboard.html",
            "/api/student-dashboard.html",
            "/api/teacher-dashboard.html",
            "/login.html",
            "/register.html"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
