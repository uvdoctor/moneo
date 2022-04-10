import React, { Fragment, useState } from "react";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/lib/date-picker/generatePicker";
import "antd/lib/date-picker/style/index";
import { parse } from "date-fns";
import { SizeType } from "antd/lib/config-provider/SizeContext";
import { RangeValue } from "rc-picker/lib/interface";
import { getMonthName } from "../utils";
import LabelWithTooltip from "./LabelWithTooltip";
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);
const { RangePicker } = DatePicker;
interface DateInputProps {
  className?: string;
  title: string;
  startDateHandler?: Function;
  startMonthHandler?: Function;
  startYearHandler: Function;
  endDateHandler?: Function;
  endMonthHandler?: Function;
  endYearHandler?: Function;
  startMonthValue?: number;
  endMonthValue?: number;
  startYearValue: number;
  endYearValue?: number;
  startDateValue?: number;
  endDateValue?: number;
  size?: SizeType;
  info?: string;
  disabled?: boolean;
  initialValue?: number;
  endValue?: number;
  dateWithEnddate?: boolean;
  inline?: boolean;
}

export default function DateInput({
  className,
  title,
  startDateHandler,
  startMonthHandler,
  startYearHandler,
  endDateHandler,
  endMonthHandler,
  endYearHandler,
  startMonthValue,
  endMonthValue,
  startYearValue,
  endYearValue,
  startDateValue,
  endDateValue,
  size,
  info,
  disabled,
  initialValue,
  endValue,
  dateWithEnddate,
  inline,
}: DateInputProps) {
  const [customDate, setCustomDate] = useState<Array<Date>>([]);
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const getTodayDate = (num: number) =>
    `${year - num}-${month}-${today.getDate()}`;
  const getMonthDate = () => `Apr-${year - 5}`;
  const getMonthEndDate = () => `Mar-${year + 1}`;

  const data = {
    month: {
      format: "MMM-yyyy",
      date:
        startMonthValue && startYearValue
          ? `${getMonthName(startMonthValue, true)}-${startYearValue}`
          : getMonthDate(),
      endDate:
        endMonthValue && endYearValue
          ? `${getMonthName(endMonthValue, true)}-${endYearValue}`
          : getMonthEndDate(),
    },
    date: {
      format: "dd-MMM-yyyy",
      date:
        startMonthValue && startYearValue && startDateValue
          ? `${startYearValue}-${startMonthValue}-${startDateValue}`
          : getTodayDate(20),
      endDate:
        endMonthValue && endYearValue && endDateValue
          ? `${endYearValue}-${endMonthValue}-${endDateValue}`
          : getTodayDate(0),
    },
    year: {
      format: "yyyy",
      date: startYearValue ? startYearValue : year - 20,
      endDate: endYearValue ? endYearValue : year + 1,
    },
  };
  const onOpenChange = (open: boolean) => {
    if (open && initialValue && endValue) {
      const getDateByYear = (num: number, start: boolean) =>
        new Date(num, start ? 0 : 11, start ? 1 : 31);
      const dates = [
        getDateByYear(initialValue, true),
        getDateByYear(endValue, false),
      ];
      setCustomDate([...dates]);
    }
  };
  const disabledDate = (date: Date) => {
    const dateYear = date.getFullYear();
    if (Math.abs(dateYear - year) > 100) return true;
    if (!customDate || !customDate.length || !date) return false;
    return (
      date.getFullYear() < customDate[0].getFullYear() ||
      date.getFullYear() > customDate[1].getFullYear()
    );
  };

  const picker = startDateHandler
    ? "date"
    : startMonthHandler
    ? "month"
    : "year";
  const { format, date, endDate } = data[picker];

  return (
    <Fragment>
      {inline ? (
        <span className={className ? className : "date"}>
          <LabelWithTooltip label={`${title} `} info={info} inline />
        </span>
      ) : (
        <div className={className ? className : "date"}>
          <LabelWithTooltip label={title} info={info} />
        </div>
      )}
      <span>
        {endMonthHandler || endYearHandler || endDateHandler ? (
          <RangePicker
            allowClear={false}
            picker={picker}
            size={size ? size : "small"}
            defaultValue={[
              parse(date as string, format, today),
              parse(endDate as string, format, today),
            ]}
            format={format}
            onChange={(values: RangeValue<Date> | null) => {
              const start = values?.[0];
              const end = values?.[1];
              if (start && end) {
                const startYear = start.getFullYear();
                startYearHandler(startYear > year ? year : startYear);
                endYearHandler &&
                  endYearHandler(
                    end.getFullYear() < year ? year : end.getFullYear()
                  );
                startMonthHandler &&
                  startMonthHandler(
                    start.getMonth() > month - 1 && startYear >= year
                      ? month
                      : start.getMonth() + 1
                  );
                endMonthHandler &&
                  endMonthHandler(
                    end.getFullYear() < year ||
                      (end.getFullYear() === year && end.getMonth() < month - 1)
                      ? month
                      : end.getMonth() + 1
                  );
                startDateHandler && startDateHandler(start.getDate());
                endDateHandler && endDateHandler(end.getDate());
              }
            }}
            disabled={disabled}
            disabledDate={(date: Date) => disabledDate(date)}
            onOpenChange={onOpenChange}
            value={[
              new Date(
                startYearValue ? startYearValue : year,
                startMonthValue ? startMonthValue - 1 : month - 1,
                startDateValue ? startDateValue : 1
              ),
              new Date(
                endYearValue ? endYearValue : year + 1,
                endMonthValue ? endMonthValue - 1 : month,
                endDateValue ? endDateValue : 1
              ),
            ]}
          />
        ) : (
          <DatePicker
            picker={picker}
            allowClear={false}
            size={size ? size : "small"}
            format={format}
            onChange={(value: Date | null) => {
              if (!value) return;
              const monthValue =
                value.getMonth() > month - 1 &&
                value.getFullYear() >= year &&
                !dateWithEnddate
                  ? month
                  : value.getMonth() + 1;
              const yearValue =
                value.getFullYear() >= year && !dateWithEnddate
                  ? year
                  : value?.getFullYear();

              startDateHandler && startDateHandler(value?.getDate());
              startMonthHandler && startMonthHandler(monthValue);
              startYearHandler && startYearHandler(yearValue);
            }}
            disabled={disabled}
            disabledDate={(date: Date) => disabledDate(date)}
            onOpenChange={onOpenChange}
            value={
              new Date(
                startYearValue ? startYearValue : year,
                startMonthValue ? startMonthValue - 1 : month - 1,
                startDateValue ? startDateValue : 1
              )
            }
          />
        )}
      </span>
    </Fragment>
  );
}
