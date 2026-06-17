package com.fittracker.model;

import java.time.LocalDate;

public class WeightRecord {
    private Long id;
    private String openid;
    private double weight;
    private LocalDate recordDate;
    private String note;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
