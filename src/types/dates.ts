export const DATE_FORMAT = {
  HOURS_MINUTES: 'HH:mm',
  SUPABASE_DAY: 'yyyy-MM-dd',
  DAY: 'd',
  WEEK_DAY: 'eee',
  DATE_WRITTEN: 'dd MMM yyyy',
  DATE_TIME: "yyyy-MM-dd'T'HH:mm:ssxxx",
} as const;

export enum TimeframesEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
