package com.fittracker.model;

import java.time.LocalDate;
import java.util.List;

public class DietRecord {
    private Long id;
    private String openid;
    private String mealType;
    private LocalDate recordDate;
    private List<FoodItem> foods;
    private int totalCalories;
    private List<String> photoUrls;
    private String note;

    public static class FoodItem {
        private String name;
        private String amount;
        private int calories;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public int getCalories() { return calories; }
        public void setCalories(int calories) { this.calories = calories; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOpenid() { return openid; }
    public void setOpenid(String openid) { this.openid = openid; }
    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public List<FoodItem> getFoods() { return foods; }
    public void setFoods(List<FoodItem> foods) { this.foods = foods; }
    public int getTotalCalories() { return totalCalories; }
    public void setTotalCalories(int totalCalories) { this.totalCalories = totalCalories; }
    public List<String> getPhotoUrls() { return photoUrls; }
    public void setPhotoUrls(List<String> photoUrls) { this.photoUrls = photoUrls; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
