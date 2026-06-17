package com.fittracker.model;

public class Stats {
    private int totalWeights;
    private int totalDiets;
    private int totalExercises;
    private int streakDays;

    public Stats(int totalWeights, int totalDiets, int totalExercises, int streakDays) {
        this.totalWeights = totalWeights;
        this.totalDiets = totalDiets;
        this.totalExercises = totalExercises;
        this.streakDays = streakDays;
    }

    public int getTotalWeights() { return totalWeights; }
    public int getTotalDiets() { return totalDiets; }
    public int getTotalExercises() { return totalExercises; }
    public int getStreakDays() { return streakDays; }
}
