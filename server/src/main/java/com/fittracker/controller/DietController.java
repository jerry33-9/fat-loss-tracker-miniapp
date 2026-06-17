package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.DietRecord;
import com.fittracker.service.DietService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diets")
public class DietController {

    private final DietService service;

    public DietController(DietService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<DietRecord>> list(
            @RequestParam(required = false) String date,
            @RequestHeader("X-Openid") String openid) {
        if (date != null && !date.isEmpty()) {
            return ApiResponse.ok(service.listByDate(openid, date));
        }
        return ApiResponse.ok(service.list(openid));
    }

    @PostMapping
    public ApiResponse<Void> add(@RequestBody DietRecord record,
                                  @RequestHeader("X-Openid") String openid) {
        service.add(openid, record);
        return ApiResponse.ok(null);
    }
}
