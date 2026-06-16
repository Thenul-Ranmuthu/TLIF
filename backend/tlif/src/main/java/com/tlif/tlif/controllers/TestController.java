package com.tlif.tlif.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping
public class TestController {

    @GetMapping("/home")
    public String homeMethod() {
        return "This is the HOME page";
    }

    @GetMapping("/user")
    public String userMethod() {
        return "This is the USER page";
    }
}
