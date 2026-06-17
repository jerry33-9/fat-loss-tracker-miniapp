package com.fittracker.model;

import java.time.LocalDate;

public class ExerciseRecord {
    private Long id;
    private String openid;
    private String type;
    private int duration;
    private int calories;
    private LocalDate recordDate;
    private String note;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
