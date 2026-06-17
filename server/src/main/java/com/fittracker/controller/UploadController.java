package com.fittracker.controller;

import com.fittracker.model.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Value("${upload.path:./uploads}")
    private String uploadPath;

    @PostMapping("/upload")
    public ApiResponse<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(uploadPath));

            String originalName = file.getOriginalFilename();
            String ext = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID().toString().replace("-", "") + ext;

            Path targetPath = Paths.get(uploadPath, filename);
            file.transferTo(targetPath.toFile());

            String url = "/uploads/" + filename;
            return ApiResponse.ok(Map.of("url", url));
        } catch (IOException e) {
            return ApiResponse.fail("上传失败: " + e.getMessage());
        }
    }
}
