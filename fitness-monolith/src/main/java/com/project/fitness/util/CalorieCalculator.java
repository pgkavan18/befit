package com.project.fitness.util;

import com.project.fitness.model.ActivityType;

import java.util.Map;

/**
 * Utility for estimating caloric expenditure based on standard Metabolic Equivalent of Task (MET)
 * values defined by the American College of Sports Medicine (ACSM) Compendium of Physical Activities.
 *
 * Formula:
 * Calories = MET * Weight(kg) * (Duration(minutes) / 60) * IntensityMultiplier
 */
public class CalorieCalculator {

    public static final double DEFAULT_WEIGHT_KG = 70.0;

    /**
     * Standard MET values per activity category for moderate intensity.
     */
    public static double getBaseMET(ActivityType type) {
        if (type == null) return 5.0;
        return switch (type) {
            case RUNNING -> 9.8;
            case CYCLING -> 7.5;
            case SWIMMING -> 8.0;
            case WEIGHT_TRAINING -> 5.0;
            case CARDIO -> 8.0;
            case WALKING -> 3.8;
            case YOGA -> 3.0;
            case STRETCHING -> 2.5;
            case OTHER -> 4.5;
        };
    }

    /**
     * Intensity multiplier:
     * - LOW: 0.8x
     * - MODERATE: 1.0x (default)
     * - VIGOROUS / HIGH: 1.25x
     */
    public static double getIntensityMultiplier(String intensity) {
        if (intensity == null) return 1.0;
        return switch (intensity.trim().toUpperCase()) {
            case "LOW" -> 0.8;
            case "VIGOROUS", "HIGH" -> 1.25;
            default -> 1.0;
        };
    }

    /**
     * Calculates estimated calories burned using default fallback weight if none specified.
     */
    public static int calculateCalories(ActivityType type, int durationMinutes, Map<String, Object> additionalMetrics) {
        return calculateCalories(type, durationMinutes, additionalMetrics, null);
    }

    /**
     * Calculates estimated calories burned with user's personal weight fallback.
     *
     * @param type Activity type
     * @param durationMinutes Duration in minutes
     * @param additionalMetrics Optional additional metrics (distance_km, avg_heart_rate, intensity, weight_kg)
     * @param userWeightKg Optional user's profile weight in kg (defaults to DEFAULT_WEIGHT_KG if null)
     * @return Integer estimated calories burned (rounded)
     */
    public static int calculateCalories(ActivityType type, int durationMinutes, Map<String, Object> additionalMetrics, Double userWeightKg) {
        if (durationMinutes <= 0) return 0;

        double weightKg = (userWeightKg != null && userWeightKg > 0) ? userWeightKg : DEFAULT_WEIGHT_KG;
        String intensity = "MODERATE";
        Double distanceKm = null;
        Integer heartRate = null;

        if (additionalMetrics != null) {
            if (additionalMetrics.get("weight_kg") instanceof Number num) {
                weightKg = num.doubleValue();
            }
            if (additionalMetrics.get("intensity") instanceof String s) {
                intensity = s;
            }
            if (additionalMetrics.get("distance_km") instanceof Number num) {
                distanceKm = num.doubleValue();
            }
            if (additionalMetrics.get("avg_heart_rate") instanceof Number num) {
                heartRate = num.intValue();
            }
        }

        // Distance-based refinement for running/cycling if distance is significant
        if (distanceKm != null && distanceKm > 0) {
            if (type == ActivityType.RUNNING) {
                // Running burns ~1.03 kcal per kg per km
                double distanceCalories = distanceKm * weightKg * 1.03;
                return (int) Math.round(distanceCalories);
            } else if (type == ActivityType.WALKING) {
                // Walking burns ~0.53 kcal per kg per km
                double distanceCalories = distanceKm * weightKg * 0.53;
                return (int) Math.round(distanceCalories);
            } else if (type == ActivityType.CYCLING) {
                // Cycling burns ~0.35 - 0.45 kcal per kg per km depending on speed
                double distanceCalories = distanceKm * weightKg * 0.40;
                return (int) Math.round(distanceCalories);
            }
        }

        // Heart rate refinement if available
        double hrMultiplier = 1.0;
        if (heartRate != null && heartRate > 0) {
            if (heartRate >= 160) {
                hrMultiplier = 1.25;
            } else if (heartRate >= 140) {
                hrMultiplier = 1.12;
            } else if (heartRate < 110) {
                hrMultiplier = 0.85;
            }
        }

        double baseMet = getBaseMET(type);
        double intensityMultiplier = getIntensityMultiplier(intensity);

        double calories = baseMet * weightKg * (durationMinutes / 60.0) * intensityMultiplier * hrMultiplier;
        return Math.max(1, (int) Math.round(calories));
    }
}
