package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.ExerciseRecord;
import com.fittracker.service.ExerciseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService service;

    public ExerciseController(ExerciseService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<ExerciseRecord>> list(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestHeader("X-Openid") String openid) {
        if (startDate != null && endDate != null) {
            return ApiResponse.ok(service.listByDateRange(openid, startDate, endDate));
        }
        return ApiResponse.ok(service.list(openid));
    }

    @PostMapping
    public ApiResponse<Void> add(@RequestBody ExerciseRecord record,
                                  @RequestHeader("X-Openid") String openid) {
        service.add(openid, record);
        return ApiResponse.ok(null);
    }
}
