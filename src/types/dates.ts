import { startOfDay, startOfWeek } from 'date-fns';

export const DATE_FORMAT = {
  HOURS_MINUTES: 'HH:mm',
  SUPABASE_DAY: 'yyyy-MM-dd',
  DAY: 'd',
  WEEK_DAY: 'eee',
  WEEK_DAY_LONG: 'eeee',
  DATE_WRITTEN: 'dd MMM yyyy',
  DATE_TIME: "yyyy-MM-dd'T'HH:mm:ssxxx",
} as const;

export enum TimeframesEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export const today = startOfDay(new Date());

export const getStartOfWeek = (date: Date) => startOfWeek(new Date(date), { weekStartsOn: 1 });
