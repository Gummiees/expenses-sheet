import moment from 'moment';

const TOTAL_MONTHS_YEARLY = 12;

export function getLast12Months(initialDate?: Date): Date[] {
  const months = [];
  for (let i = 0; i < TOTAL_MONTHS_YEARLY; i++) {
    months.push(
      moment(initialDate)
        .subtract(TOTAL_MONTHS_YEARLY - 1 - i, 'month')
        .toDate()
    );
  }

  return months;
}
