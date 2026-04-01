import type { HiveType, BroodPattern, Temperament, HoneyStores, WeatherCondition, RecurringType, TipCategory } from './types';

export const HIVE_TYPES: HiveType[] = ['Spaarkast', 'Simplex', 'Segeberger', 'Dadant', 'Langstroth', 'Warré', 'Other'];

export const BROOD_PATTERNS: BroodPattern[] = ['Excellent', 'Good', 'Fair', 'Poor', 'None'];

export const TEMPERAMENTS: Temperament[] = ['Calm', 'Nervous', 'Aggressive'];

export const HONEY_STORES: HoneyStores[] = ['Abundant', 'Adequate', 'Low', 'Empty'];

export const WEATHER_CONDITIONS: WeatherCondition[] = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Overcast'];

export const RECURRING_OPTIONS: { value: RecurringType; label: string }[] = [
  { value: 'none', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
];

export const COMMON_PESTS = [
  'Varroa Mites',
  'Small Hive Beetle',
  'Wax Moths',
  'Nosema',
  'American Foulbrood',
  'European Foulbrood',
  'Chalkbrood',
  'Tracheal Mites',
  'Ants',
  'Wasps',
];

export const TIP_CATEGORIES: { value: TipCategory; label: string; color: string }[] = [
  { value: 'inspection', label: 'Inspection', color: 'bg-blue-100 text-blue-800' },
  { value: 'feeding', label: 'Feeding', color: 'bg-amber-100 text-amber-800' },
  { value: 'treatment', label: 'Treatment', color: 'bg-red-100 text-red-800' },
  { value: 'harvest', label: 'Harvest', color: 'bg-green-100 text-green-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

