package com.fittracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittracker.config.WechatConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WechatService {

    private final WechatConfig config;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final String WECHAT_URL = "https://api.weixin.qq.com/sns/jscode2session";

    public WechatService(WechatConfig config) {
        this.config = config;
        this.webClient = WebClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public String code2openid(String code) {
        try {
            String url = WECHAT_URL + "?appid=" + config.getAppid()
                    + "&secret=" + config.getSecret()
                    + "&js_code=" + code
                    + "&grant_type=authorization_code";

            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode node = objectMapper.readTree(response);
            if (node.has("openid")) {
                return node.get("openid").asText();
            }
            throw new RuntimeException("微信登录失败: " + node.path("errmsg").asText());
        } catch (Exception e) {
            throw new RuntimeException("微信登录异常: " + e.getMessage());
        }
    }
}
