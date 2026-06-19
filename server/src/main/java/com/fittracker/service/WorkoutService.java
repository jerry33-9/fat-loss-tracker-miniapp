package com.fittracker.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fittracker.model.WorkoutRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkoutService {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WorkoutService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<WorkoutRecord> list(String openid) {
        return jdbc.query(
            "SELECT * FROM t_workout WHERE openid = ? ORDER BY record_date DESC, id DESC",
            (rs, rowNum) -> buildRecord(rs),
            openid
        );
    }

    public List<WorkoutRecord> listByDateRange(String openid, String start, String end) {
        return jdbc.query(
            "SELECT * FROM t_workout WHERE openid = ? AND record_date BETWEEN ? AND ? ORDER BY record_date ASC",
            (rs, rowNum) -> buildRecord(rs),
            openid, start, end
        );
    }

    public void add(String openid, WorkoutRecord record) {
        try {
            String exercisesJson = objectMapper.writeValueAsString(record.getExercises());
            jdbc.update(
                "INSERT INTO t_workout (openid, record_date, exercises, duration, calories, note) VALUES (?, ?, ?, ?, ?, ?)",
                openid, record.getRecordDate(), exercisesJson,
                record.getDuration(), record.getCalories(), record.getNote()
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化失败", e);
        }
    }

    public int count(String openid) {
        var result = jdbc.queryForObject(
            "SELECT COUNT(*) FROM t_workout WHERE openid = ?", Integer.class, openid
        );
        return result != null ? result : 0;
    }

    private WorkoutRecord buildRecord(java.sql.ResultSet rs) throws java.sql.SQLException {
        WorkoutRecord r = new WorkoutRecord();
        r.setId(rs.getLong("id"));
        r.setRecordDate(rs.getDate("record_date").toLocalDate());
        r.setExercises(parseExercises(rs.getString("exercises")));
        r.setDuration(rs.getInt("duration"));
        r.setCalories(rs.getInt("calories"));
        r.setNote(rs.getString("note"));
        return r;
    }

    private List<WorkoutRecord.WorkoutExercise> parseExercises(String json) {
        try {
            if (json == null) return new ArrayList<>();
            return objectMapper.readValue(json, new TypeReference<List<WorkoutRecord.WorkoutExercise>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
