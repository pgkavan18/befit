/**
 * BMI & Body Metrics Utility
 * WHO standards and Mifflin-St Jeor metabolic formulas
 */

export const calculateBmi = (weightKg, heightCm) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h || h <= 0 || w <= 0) return null;
  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const getBmiCategory = (bmi) => {
  if (bmi == null || isNaN(bmi)) return null;

  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      shortLabel: 'Underweight',
      color: '#38bdf8', // Cyan
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.35)',
      gaugePercent: Math.max(5, Math.min(25, ((bmi - 12) / 6.5) * 25)),
      description: 'Your weight is below the standard recommended range for your height.',
      advice: 'Focus on nutrient-dense calorie surplus, progressive resistance training, and protein intake to build lean muscle mass.',
      statusClass: 'status-underweight',
    };
  } else if (bmi < 25.0) {
    return {
      category: 'Normal weight',
      shortLabel: 'Healthy',
      color: 'var(--accent-lime, #adff2f)', // Lime Green
      badgeBg: 'rgba(173, 255, 47, 0.15)',
      badgeBorder: 'rgba(173, 255, 47, 0.35)',
      gaugePercent: Math.max(26, Math.min(50, 25 + ((bmi - 18.5) / 6.4) * 25)),
      description: 'You are in a healthy, optimal weight range for your height.',
      advice: 'Maintain your current activity level and balanced nutrition. Aim for consistency across strength, cardio, and active recovery.',
      statusClass: 'status-normal',
    };
  } else if (bmi < 30.0) {
    return {
      category: 'Overweight',
      shortLabel: 'Overweight',
      color: '#fbbf24', // Amber/Yellow
      badgeBg: 'rgba(251, 191, 36, 0.15)',
      badgeBorder: 'rgba(251, 191, 36, 0.35)',
      gaugePercent: Math.max(51, Math.min(75, 50 + ((bmi - 25.0) / 4.9) * 25)),
      description: 'Your weight is slightly higher than the standard recommended range for your height.',
      advice: 'Incorporate regular moderate-to-high intensity cardiovascular exercise alongside a slight caloric deficit and whole foods.',
      statusClass: 'status-overweight',
    };
  } else {
    return {
      category: 'Obese',
      shortLabel: 'Obese',
      color: '#f87171', // Red
      badgeBg: 'rgba(248, 113, 113, 0.15)',
      badgeBorder: 'rgba(248, 113, 113, 0.35)',
      gaugePercent: Math.max(76, Math.min(100, 75 + Math.min(25, ((bmi - 30.0) / 10.0) * 25))),
      description: 'Your weight is significantly higher than the standard recommended range.',
      advice: 'Consult with healthcare or fitness professionals for a structured low-impact cardio routine and sustainable dietary adjustments.',
      statusClass: 'status-obese',
    };
  }
};

/**
 * Calculates healthy weight range (kg) for a given height (cm)
 * based on healthy BMI range 18.5 - 24.9
 */
export const getHealthyWeightRange = (heightCm) => {
  const h = parseFloat(heightCm);
  if (!h || h <= 0) return null;
  const heightM = h / 100;
  const minWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxWeight = Math.round(24.9 * heightM * heightM * 10) / 10;
  return { minWeight, maxWeight };
};

/**
 * Calculates Basal Metabolic Rate (BMR) via Mifflin-St Jeor formula
 */
export const calculateBmr = (weightKg, heightCm, ageYears, isFemale = false) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  const a = parseInt(ageYears, 10);
  if (!w || !h || !a) return null;

  // Mifflin-St Jeor: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + s
  // s = +5 for males, -161 for females
  const base = 10 * w + 6.25 * h - 5 * a;
  const bmr = isFemale ? base - 161 : base + 5;
  return Math.round(bmr);
};
