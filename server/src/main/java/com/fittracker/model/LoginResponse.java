package com.fittracker.model;

public class LoginResponse {
    private String token;
    private String openid;

    public LoginResponse(String token, String openid) {
        this.token = token;
        this.openid = openid;
    }

    public String getToken() { return token; }
    public String getOpenid() { return openid; }
}
