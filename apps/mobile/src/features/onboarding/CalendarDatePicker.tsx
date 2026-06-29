import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CalendarDatePickerProps = {
  error?: string;
  label: string;
  maxDate: Date;
  minDate: Date;
  onChange: (date?: string) => void;
  value?: string;
};

const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export function CalendarDatePicker({
  error,
  label,
  maxDate,
  minDate,
  onChange,
  value,
}: CalendarDatePickerProps) {
  const selectedDate = value ? parseISODate(value) : null;
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? minDate));
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const canMoveToPreviousMonth = getMonthKey(visibleMonth) > getMonthKey(minDate);
  const canMoveToNextMonth = getMonthKey(visibleMonth) < getMonthKey(maxDate);

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {value ? (
          <Pressable accessibilityRole="button" onPress={() => onChange(undefined)}>
            <Text style={styles.clearText}>선택 해제</Text>
          </Pressable>
        ) : (
          <Text style={styles.optionalText}>선택</Text>
        )}
      </View>

      <View style={[styles.calendar, error && styles.calendarError]}>
        <View style={styles.monthHeader}>
          <MonthButton
            disabled={!canMoveToPreviousMonth}
            label="이전 달"
            onPress={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          />
          <Text style={styles.monthTitle}>{formatMonthTitle(visibleMonth)}</Text>
          <MonthButton
            disabled={!canMoveToNextMonth}
            label="다음 달"
            onPress={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          />
        </View>

        <View style={styles.weekdays}>
          {weekdayLabels.map((weekday) => (
            <Text key={weekday} style={styles.weekday}>
              {weekday}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarDays.map((date, index) =>
            date ? (
              <DateButton
                date={date}
                isDisabled={!isDateInRange(date, minDate, maxDate)}
                isSelected={value === toISODate(date)}
                key={toISODate(date)}
                onPress={() => onChange(toISODate(date))}
              />
            ) : (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ),
          )}
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

type MonthButtonProps = {
  disabled: boolean;
  label: string;
  onPress: () => void;
};

function MonthButton({ disabled, label, onPress }: MonthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.monthButton, disabled && styles.disabledMonthButton]}
    >
      <Text style={[styles.monthButtonText, disabled && styles.disabledMonthButtonText]}>
        {label}
      </Text>
    </Pressable>
  );
}

type DateButtonProps = {
  date: Date;
  isDisabled: boolean;
  isSelected: boolean;
  onPress: () => void;
};

function DateButton({ date, isDisabled, isSelected, onPress }: DateButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.dayCell,
        styles.dayButton,
        isSelected && styles.selectedDayButton,
        isDisabled && styles.disabledDayButton,
      ]}
    >
      <Text
        style={[
          styles.dayText,
          isSelected && styles.selectedDayText,
          isDisabled && styles.disabledDayText,
        ]}
      >
        {date.getDate()}
      </Text>
    </Pressable>
  );
}

function getCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();
  const days: Array<Date | null> = Array.from({ length: leadingEmptyDays }, () => null);

  for (let day = 1; day <= dayCount; day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  const trailingEmptyDays = (7 - (days.length % 7)) % 7;

  return days.concat(Array.from({ length: trailingEmptyDays }, () => null));
}

function isDateInRange(date: Date, minDate: Date, maxDate: Date) {
  const value = startOfDay(date).getTime();

  return value >= startOfDay(minDate).getTime() && value <= startOfDay(maxDate).getTime();
}

function parseISODate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function formatMonthTitle(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#26342C",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  optionalText: {
    color: "#7A867E",
    fontSize: 13,
    fontWeight: "700",
  },
  clearText: {
    color: "#5E7664",
    fontSize: 13,
    fontWeight: "800",
  },
  calendar: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  calendarError: {
    borderColor: "#B95E4E",
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthButton: {
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 72,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabledMonthButton: {
    opacity: 0.35,
  },
  monthButtonText: {
    color: "#314339",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  disabledMonthButtonText: {
    color: "#7A867E",
  },
  monthTitle: {
    color: "#1F2A24",
    fontSize: 16,
    fontWeight: "800",
  },
  weekdays: {
    flexDirection: "row",
  },
  weekday: {
    color: "#7A867E",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
    width: "14.2857%",
  },
  dayButton: {
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: "#2F5D46",
  },
  disabledDayButton: {
    opacity: 0.28,
  },
  dayText: {
    color: "#26342C",
    fontSize: 14,
    fontWeight: "700",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  disabledDayText: {
    color: "#7A867E",
  },
  error: {
    color: "#9A4B40",
    fontSize: 13,
    lineHeight: 18,
  },
});
