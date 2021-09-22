import { addWeeks, subWeeks } from 'date-fns';

import { btnEnum } from '../types/buttons';

export const onChangeWeek = (btnAction: btnEnum, date: Date) => {
  if (btnAction === btnEnum.PREV) {
    const newDate = subWeeks(date, 1);

    return newDate;
  } else if (btnAction === btnEnum.NEXT) {
    const newDate = addWeeks(date, 1);

    return newDate;
  }
};
