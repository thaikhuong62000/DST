import {addDays, format, getDate, isSameDay, startOfWeek} from 'date-fns';
import { startOfMonth } from 'date-fns/esm';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type Props = {
  date: Date;
  onChange: (value: Date) => void;
};

export default function WeekCalendar({ date, onChange, cuscomWeek, day, month, year }) {
  const [week, setWeek] = useState<WeekDay[]>([]);

  useEffect(() => {
    // const weekDays = getWeekDays(date);
    const weekDays = (cuscomWeek) ? getWeekDays2(day, month, year) : getWeekDays(date);
    setWeek(weekDays);
  }, [date]);

  return (
    <View style={styles.container}>
      {week.map((weekDay) => {
        const textStyles = [styles.label];
        const touchable = [styles.touchable];

        const sameDay = isSameDay(weekDay.date, date);
        if (sameDay) {
          textStyles.push(styles.selectedLabel);
          touchable.push(styles.selectedTouchable);
        }

        return (
          <View style={styles.weekDayItem} key={weekDay.formatted}>
            <Text style={styles.weekDayText}>{weekDay.formatted}</Text>
            <TouchableOpacity
              onPress={() => onChange(weekDay.date)}
              style={touchable}>
              <Text style={textStyles}>{weekDay.day}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  weekDayText: {
    color: 'gray',
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  selectedLabel: {
    color: 'white',
  },
  touchable: {
    borderRadius: 20,
    padding: 7.5,
    height: 35,
    width: 35,
  },
  selectedTouchable: {
    backgroundColor: '#3B3DBF',
  },
  weekDayItem: {
    alignItems: 'center',
  },
});

type WeekDay = {
  formatted: string;
  date: Date;
  day: number;
};

// get week days
export const getWeekDays = (date: Date): WeekDay[] => {
  const start = startOfWeek(date, {weekStartsOn: 1});

  const final = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    final.push({
      formatted: format(date, 'EEEEEE'),
      date,
      day: getDate(date),
    });
  }

  return final;
};

export const getWeekDays2 = (day, month, year): WeekDay[] => {
  const weeks = new Date(year, month, day);
  const start = startOfWeek(weeks, {weekStartsOn: 0});

  const final = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    final.push({
      formatted: format(date, 'EEEEEE'),
      date,
      day: getDate(date),
    });
  }

  return final;
};