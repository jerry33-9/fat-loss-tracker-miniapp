package com.fittracker.model;

import java.time.LocalDate;
import java.util.List;

public class WorkoutRecord {
    private Long id;
    private String openid;
    private LocalDate recordDate;
    private List<WorkoutExercise> exercises;
    private int duration;
    private int calories;
    private String note;

    public static class WorkoutExercise {
        private String name;
        private int sets;
        private int reps;
        private Double weight;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getSets() { return sets; }
        public void setSets(int sets) { this.sets = sets; }
        public int getReps() { return reps; }
        public void setReps(int reps) { this.reps = reps; }
        public Double getWeight() { return weight; }
        public void setWeight(Double weight) { this.weight = weight; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public List<WorkoutExercise> getExercises() { return exercises; }
    public void setExercises(List<WorkoutExercise> exercises) { this.exercises = exercises; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
