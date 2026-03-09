package com.swiftpulse.identity.cucumber;

import io.cucumber.core.options.Constants;
import io.cucumber.java.Before;
import io.cucumber.java.After;
import io.cucumber.java.Scenario;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CucumberReportConfiguration {

    @Before
    public void beforeScenario(Scenario scenario) {
        System.out.println("Starting scenario: " + scenario.getName());
        System.out.println("Tags: " + scenario.getSourceTagNames());
    }

    @After
    public void afterScenario(Scenario scenario) {
        System.out.println("Finished scenario: " + scenario.getName());
        System.out.println("Status: " + scenario.getStatus());
        
        if (scenario.isFailed()) {
            System.err.println("Scenario failed: " + scenario.getName());
            // Add screenshot capture for web tests here if needed
        }
    }
}
