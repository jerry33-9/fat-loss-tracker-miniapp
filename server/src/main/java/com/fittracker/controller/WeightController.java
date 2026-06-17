package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.WeightRecord;
import com.fittracker.service.WeightService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weights")
public class WeightController {

    private final WeightService service;

    public WeightController(WeightService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<WeightRecord>> list(
            @RequestParam(defaultValue = "30") int limit,
            @RequestHeader("X-Openid") String openid) {
        return ApiResponse.ok(service.list(openid, limit));
    }

    @PostMapping
    public ApiResponse<Void> add(@RequestBody WeightRecord record,
                                  @RequestHeader("X-Openid") String openid) {
        service.add(openid, record);
        return ApiResponse.ok(null);
    }
}
