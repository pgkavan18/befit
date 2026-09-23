package com.project.fitness.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserBmiTest {

    @Test
    void testNormalBmiCalculation() {
        User user = User.builder()
                .height(175.0)
                .weight(70.0)
                .build();

        // 70 / (1.75 * 1.75) = 22.857... -> rounded to 22.9
        assertEquals(22.9, user.getBmi());
        assertEquals("Normal weight", user.getBmiCategory());
    }

    @Test
    void testUnderweightBmiCalculation() {
        User user = User.builder()
                .height(180.0)
                .weight(50.0)
                .build();

        // 50 / (1.8 * 1.8) = 15.43... -> 15.4
        assertEquals(15.4, user.getBmi());
        assertEquals("Underweight", user.getBmiCategory());
    }

    @Test
    void testOverweightBmiCalculation() {
        User user = User.builder()
                .height(170.0)
                .weight(80.0)
                .build();

        // 80 / (1.7 * 1.7) = 27.68... -> 27.7
        assertEquals(27.7, user.getBmi());
        assertEquals("Overweight", user.getBmiCategory());
    }

    @Test
    void testObeseBmiCalculation() {
        User user = User.builder()
                .height(170.0)
                .weight(100.0)
                .build();

        // 100 / (1.7 * 1.7) = 34.60... -> 34.6
        assertEquals(34.6, user.getBmi());
        assertEquals("Obese", user.getBmiCategory());
    }

    @Test
    void testNullMetricsReturnNullBmi() {
        User user = User.builder().build();
        assertNull(user.getBmi());
        assertNull(user.getBmiCategory());

        User partialUser = User.builder().height(170.0).build();
        assertNull(partialUser.getBmi());
        assertNull(partialUser.getBmiCategory());
    }
}
