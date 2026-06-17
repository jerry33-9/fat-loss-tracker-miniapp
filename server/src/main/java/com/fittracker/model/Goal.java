package com.fittracker.model;

import java.time.LocalDate;

public class Goal {
    private Long id;
    private String openid;
    private double targetWeight;
    private double startWeight;
    private double weeklyTarget;
    private LocalDate startDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public double getTargetWeight() { return targetWeight; }
    public void setTargetWeight(double targetWeight) { this.targetWeight = targetWeight; }
    public double getStartWeight() { return startWeight; }
    public void setStartWeight(double startWeight) { this.startWeight = startWeight; }
    public double getWeeklyTarget() { return weeklyTarget; }
    public void setWeeklyTarget(double weeklyTarget) { this.weeklyTarget = weeklyTarget; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
}
