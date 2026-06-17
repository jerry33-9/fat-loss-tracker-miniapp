package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.Goal;
import com.fittracker.service.GoalService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goal")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<Goal> get(@RequestHeader("X-Openid") String openid) {
        return ApiResponse.ok(service.get(openid));
    }

    @PostMapping
    public ApiResponse<Void> save(@RequestBody Goal goal,
                                   @RequestHeader("X-Openid") String openid) {
        service.save(openid, goal);
        return ApiResponse.ok(null);
    }

    @DeleteMapping
    public ApiResponse<Void> delete(@RequestHeader("X-Openid") String openid) {
        service.delete(openid);
        return ApiResponse.ok(null);
    }
}
