package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.Stats;
import com.fittracker.service.GoalService;
import com.fittracker.service.WorkoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final GoalService goalService;
    private final WorkoutService workoutService;

    public StatsController(GoalService goalService, WorkoutService workoutService) {
        this.goalService = goalService;
        this.workoutService = workoutService;
    }

    @GetMapping
    public ApiResponse<Stats> get(@RequestHeader("X-Openid") String openid) {
        Stats stats = new Stats(
            goalService.countWeights(openid),
            goalService.countDiets(openid),
            workoutService.count(openid),
            0
        );
        return ApiResponse.ok(stats);
    }
}
