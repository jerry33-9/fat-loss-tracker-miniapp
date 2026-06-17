package com.fittracker.service;

import com.fittracker.model.WeightRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeightService {

    private final JdbcTemplate jdbc;

    public WeightService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<WeightRecord> rowMapper = (rs, rowNum) -> {
        WeightRecord r = new WeightRecord();
        r.setId(rs.getLong("id"));
        r.setWeight(rs.getDouble("weight"));
        r.setRecordDate(rs.getDate("record_date").toLocalDate());
        r.setNote(rs.getString("note"));
        return r;
    };

    public List<WeightRecord> list(String openid, int limit) {
        return jdbc.query(
            "SELECT * FROM t_weight WHERE openid = ? ORDER BY record_date DESC, id DESC LIMIT ?",
            rowMapper, openid, limit
        );
    }

    public void add(String openid, WeightRecord record) {
        jdbc.update(
            "INSERT INTO t_weight (openid, weight, record_date, note) VALUES (?, ?, ?, ?)",
            openid, record.getWeight(), record.getRecordDate(), record.getNote()
        );
    }
}
