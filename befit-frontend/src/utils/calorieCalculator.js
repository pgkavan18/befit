/**
 * Metabolic Equivalent of Task (MET) values and physiological calorie estimation
 * based on the Compendium of Physical Activities (ACSM).
 *
 * Formula:
 * Calories = MET * Weight(kg) * (Duration(mins) / 60) * IntensityMultiplier * HRMultiplier
 */

export const MET_TABLE = {
  RUNNING: { name: 'Running', met: 9.8, ratePerKm: 1.03, icon: 'Flame' },
  CYCLING: { name: 'Cycling', met: 7.5, ratePerKm: 0.40, icon: 'Bike' },
  SWIMMING: { name: 'Swimming', met: 8.0, ratePerKm: 3.0, icon: 'Waves' },
  WEIGHT_TRAINING: { name: 'Weight Training', met: 5.0, ratePerKm: null, icon: 'Dumbbell' },
  CARDIO: { name: 'HIIT / Cardio', met: 8.0, ratePerKm: null, icon: 'Zap' },
  WALKING: { name: 'Walking', met: 3.8, ratePerKm: 0.53, icon: 'Footprints' },
  YOGA: { name: 'Yoga', met: 3.0, ratePerKm: null, icon: 'Heart' },
  STRETCHING: { name: 'Stretching', met: 2.5, ratePerKm: null, icon: 'Sparkles' },
};

export const INTENSITY_LEVELS = [
  { id: 'LOW', label: 'Low', multiplier: 0.8, description: 'Easy conversational effort' },
  { id: 'MODERATE', label: 'Moderate', multiplier: 1.0, description: 'Elevated breathing, sustained' },
  { id: 'VIGOROUS', label: 'Vigorous', multiplier: 1.25, description: 'Max heart rate, high burn' },
];

export const estimateCalories = ({
  type = 'RUNNING',
  duration = 0,
  intensity = 'MODERATE',
  weightKg = 70,
  distanceKm = null,
  heartRate = null,
}) => {
  const durationMins = Number(duration) || 0;
  if (durationMins <= 0) return 0;

  const activityMeta = MET_TABLE[type] || { met: 5.0 };
  const intensityObj = INTENSITY_LEVELS.find((i) => i.id === intensity) || { multiplier: 1.0 };

  const weight = Number(weightKg) || 70;

  // Distance refinement if provided
  const dist = Number(distanceKm);
  if (dist > 0 && activityMeta.ratePerKm) {
    const distCalories = dist * weight * activityMeta.ratePerKm;
    // Blend distance with duration (80% distance weight, 20% duration intensity)
    return Math.round(distCalories * intensityObj.multiplier);
  }

  // Heart rate refinement
  let hrMultiplier = 1.0;
  const hr = Number(heartRate);
  if (hr > 0) {
    if (hr >= 160) hrMultiplier = 1.25;
    else if (hr >= 140) hrMultiplier = 1.12;
    else if (hr < 110) hrMultiplier = 0.85;
  }

  const baseCalories = activityMeta.met * weight * (durationMins / 60) * intensityObj.multiplier * hrMultiplier;
  return Math.max(1, Math.round(baseCalories));
};
