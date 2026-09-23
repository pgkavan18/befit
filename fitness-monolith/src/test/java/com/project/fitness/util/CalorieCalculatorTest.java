package com.project.fitness.util;

import com.project.fitness.model.ActivityType;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CalorieCalculatorTest {

    @Test
    void testCaloriesWithPersonalWeight() {
        // User with 90kg vs 60kg for 60 min running
        int cal90kg = CalorieCalculator.calculateCalories(ActivityType.RUNNING, 60, null, 90.0);
        int cal60kg = CalorieCalculator.calculateCalories(ActivityType.RUNNING, 60, null, 60.0);

        assertTrue(cal90kg > cal60kg, "A heavier person should burn more calories for the same activity");
    }

    @Test
    void testCaloriesFallbackToDefaultWhenNull() {
        int calDefault = CalorieCalculator.calculateCalories(ActivityType.WALKING, 30, null);
        int calExplicitDefault = CalorieCalculator.calculateCalories(ActivityType.WALKING, 30, null, 70.0);

        assertEquals(calDefault, calExplicitDefault);
    }
}
