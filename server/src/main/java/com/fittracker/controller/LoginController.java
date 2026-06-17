package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import com.fittracker.model.LoginRequest;
import com.fittracker.model.LoginResponse;
import com.fittracker.service.WechatService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final WechatService wechatService;

    public LoginController(WechatService wechatService) {
        this.wechatService = wechatService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        String openid = wechatService.code2openid(request.getCode());
        // 简单 token：生产环境换成 JWT
        String token = UUID.randomUUID().toString().replace("-", "");
        return ApiResponse.ok(new LoginResponse(token, openid));
    }
}
