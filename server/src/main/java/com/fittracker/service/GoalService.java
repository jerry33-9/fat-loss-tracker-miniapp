package com.fittracker.service;

import com.fittracker.model.Goal;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class GoalService {

    private final JdbcTemplate jdbc;

    public GoalService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Goal get(String openid) {
        var list = jdbc.query(
            "SELECT * FROM t_goal WHERE openid = ?",
            (rs, rowNum) -> {
                Goal g = new Goal();
                g.setId(rs.getLong("id"));
                g.setTargetWeight(rs.getDouble("target_weight"));
                g.setStartWeight(rs.getDouble("start_weight"));
                g.setWeeklyTarget(rs.getDouble("weekly_target"));
                g.setStartDate(rs.getDate("start_date").toLocalDate());
                return g;
            },
            openid
        );
        return list.isEmpty() ? null : list.get(0);
    }

    public void save(String openid, Goal goal) {
        Goal existing = get(openid);
        if (existing != null) {
            jdbc.update(
                "UPDATE t_goal SET target_weight=?, start_weight=?, weekly_target=?, start_date=?, updated_at=CURRENT_TIMESTAMP WHERE openid=?",
                goal.getTargetWeight(), goal.getStartWeight(), goal.getWeeklyTarget(),
                goal.getStartDate(), openid
            );
        } else {
            jdbc.update(
                "INSERT INTO t_goal (openid, target_weight, start_weight, weekly_target, start_date) VALUES (?, ?, ?, ?, ?)",
                openid, goal.getTargetWeight(), goal.getStartWeight(),
                goal.getWeeklyTarget(), goal.getStartDate()
            );
        }
    }

    public void delete(String openid) {
        jdbc.update("DELETE FROM t_goal WHERE openid = ?", openid);
    }

    public int countWeights(String openid) {
        var result = jdbc.queryForObject(
            "SELECT COUNT(*) FROM t_weight WHERE openid = ?", Integer.class, openid
        );
        return result != null ? result : 0;
    }

    public int countDiets(String openid) {
        var result = jdbc.queryForObject(
            "SELECT COUNT(*) FROM t_diet WHERE openid = ?", Integer.class, openid
        );
        return result != null ? result : 0;
    }

    public int countExercises(String openid) {
        var result = jdbc.queryForObject(
            "SELECT COUNT(*) FROM t_exercise WHERE openid = ?", Integer.class, openid
        );
        return result != null ? result : 0;
    }
}
