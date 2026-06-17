package com.fittracker.service;

import com.fittracker.model.ExerciseRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    private final JdbcTemplate jdbc;

    public ExerciseService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public List<ExerciseRecord> list(String openid) {
        return jdbc.query(
            "SELECT * FROM t_exercise WHERE openid = ? ORDER BY record_date DESC, id DESC",
            (rs, rowNum) -> {
                ExerciseRecord r = new ExerciseRecord();
                r.setId(rs.getLong("id"));
                r.setType(rs.getString("type"));
                r.setDuration(rs.getInt("duration"));
                r.setCalories(rs.getInt("calories"));
                r.setRecordDate(rs.getDate("record_date").toLocalDate());
                r.setNote(rs.getString("note"));
                return r;
            },
            openid
        );
    }

    public List<ExerciseRecord> listByDateRange(String openid, String start, String end) {
        return jdbc.query(
            "SELECT * FROM t_exercise WHERE openid = ? AND record_date BETWEEN ? AND ? ORDER BY record_date ASC",
            (rs, rowNum) -> {
                ExerciseRecord r = new ExerciseRecord();
                r.setId(rs.getLong("id"));
                r.setType(rs.getString("type"));
                r.setDuration(rs.getInt("duration"));
                r.setCalories(rs.getInt("calories"));
                r.setRecordDate(rs.getDate("record_date").toLocalDate());
                r.setNote(rs.getString("note"));
                return r;
            },
            openid, start, end
        );
    }

    public void add(String openid, ExerciseRecord record) {
        jdbc.update(
            "INSERT INTO t_exercise (openid, type, duration, calories, record_date, note) VALUES (?, ?, ?, ?, ?, ?)",
            openid, record.getType(), record.getDuration(),
            record.getCalories(), record.getRecordDate(), record.getNote()
        );
    }
}
