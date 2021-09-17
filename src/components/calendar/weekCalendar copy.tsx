import { useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  getWeek,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';

import { DATE_FORMAT } from '../../types/dates';

type Props = {
  showDetailsHandle: (dayStr: string) => void;
};

enum btnEnum {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

const WeekCalendar = ({ showDetailsHandle }: Props) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeMonthHandle = (btnType: btnEnum) => {
    if (btnType === btnEnum.PREV) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === btnEnum.NEXT) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType: btnEnum) => {
    if (btnType === btnEnum.PREV) {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === btnEnum.NEXT) {
      //console.log(addWeeks(currentMonth, 1));
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day: Date, dayStr: string) => {
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeMonthHandle(btnEnum.PREV)}>
            prev month
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, DATE_FORMAT.DATE_WRITTEN)}</span>
        </div>
        <div className="col col-end">
          <div className="icon" onClick={() => changeMonthHandle(btnEnum.NEXT)}>
            next month
          </div>
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }

    return <div className="days row">{days}</div>;
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              isSameDay(day, new Date()) ? 'today' : isSameDay(day, selectedDate) ? 'selected' : ''
            }`}
            onClick={() => {
              const dayStr = format(cloneDay, DATE_FORMAT.DATE_WRITTEN);
              onDateClickHandle(cloneDay, dayStr);
            }}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(<div className="row">{days}</div>);
      days = [];
    }

    return <div className="body">{rows}</div>;
  };
  const renderFooter = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle(btnEnum.PREV)}>
            prev week
          </div>
        </div>
        {/* <div>{currentWeek}</div> */}
        <div className="col col-end" onClick={() => changeWeekHandle(btnEnum.NEXT)}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar">
      {/* {renderHeader()} */}
      {renderDays()}
      {renderCells()}
      {renderFooter()}
    </div>
  );
};

export default WeekCalendar;
