package com.fittracker.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittracker.model.DietRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DietService {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DietService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<DietRecord> list(String openid) {
        return jdbc.query(
            "SELECT * FROM t_diet WHERE openid = ? ORDER BY record_date DESC, id DESC",
            (rs, rowNum) -> {
                DietRecord r = new DietRecord();
                r.setId(rs.getLong("id"));
                r.setMealType(rs.getString("meal_type"));
                r.setRecordDate(rs.getDate("record_date").toLocalDate());
                r.setFoods(parseFoods(rs.getString("foods")));
                r.setTotalCalories(rs.getInt("total_calories"));
                r.setPhotoUrls(parsePhotos(rs.getString("photo_urls")));
                r.setNote(rs.getString("note"));
                return r;
            },
            openid
        );
    }

    public List<DietRecord> listByDate(String openid, String date) {
        return jdbc.query(
            "SELECT * FROM t_diet WHERE openid = ? AND record_date = ? ORDER BY id DESC",
            (rs, rowNum) -> {
                DietRecord r = new DietRecord();
                r.setId(rs.getLong("id"));
                r.setMealType(rs.getString("meal_type"));
                r.setRecordDate(rs.getDate("record_date").toLocalDate());
                r.setFoods(parseFoods(rs.getString("foods")));
                r.setTotalCalories(rs.getInt("total_calories"));
                r.setPhotoUrls(parsePhotos(rs.getString("photo_urls")));
                r.setNote(rs.getString("note"));
                return r;
            },
            openid, date
        );
    }

    public void add(String openid, DietRecord record) {
        try {
            String foodsJson = objectMapper.writeValueAsString(record.getFoods());
            String photosJson = record.getPhotoUrls() != null
                    ? objectMapper.writeValueAsString(record.getPhotoUrls()) : "[]";

            jdbc.update(
                "INSERT INTO t_diet (openid, meal_type, record_date, foods, total_calories, photo_urls, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
                openid, record.getMealType(), record.getRecordDate(),
                foodsJson, record.getTotalCalories(), photosJson, record.getNote()
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化失败", e);
        }
    }

    private List<DietRecord.FoodItem> parseFoods(String json) {
        try {
            if (json == null) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<DietRecord.FoodItem>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<String> parsePhotos(String json) {
        try {
            if (json == null) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
