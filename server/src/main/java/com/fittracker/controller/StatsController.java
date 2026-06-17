package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.Stats;
import com.fittracker.service.GoalService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final GoalService goalService;

    public StatsController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public ApiResponse<Stats> get(@RequestHeader("X-Openid") String openid) {
        Stats stats = new Stats(
            goalService.countWeights(openid),
            goalService.countDiets(openid),
            goalService.countExercises(openid),
            0
        );
        return ApiResponse.ok(stats);
    }
}
