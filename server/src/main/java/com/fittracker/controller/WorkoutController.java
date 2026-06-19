package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.WorkoutRecord;
import com.fittracker.service.WorkoutService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService service;

    public WorkoutController(WorkoutService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<WorkoutRecord>> list(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestHeader("X-Openid") String openid) {
        if (startDate != null && endDate != null) {
            return ApiResponse.ok(service.listByDateRange(openid, startDate, endDate));
        }
        return ApiResponse.ok(service.list(openid));
    }

    @PostMapping
    public ApiResponse<Void> add(@RequestBody WorkoutRecord record,
                                  @RequestHeader("X-Openid") String openid) {
        service.add(openid, record);
        return ApiResponse.ok(null);
    }
}
