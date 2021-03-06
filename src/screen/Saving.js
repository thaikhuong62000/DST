import React, {useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import {format} from 'date-fns';
import Circle from '../Circle';
import {icons, FONTS, COLORS} from '../constants';
import {ENTRIES_KEY, getData, clear} from '../Storage';
import {isSameMonth} from 'date-fns';

const Saving = ({navigation}) => {
  const [entries, setEntries] = React.useState([]);
  const [saving, setSaving] = React.useState(0);
  const [monthlyGoal, setMonthlyGoal] = React.useState({
    current: 0,
    total: 900,
  });
  const [goalList, setGoalList] = React.useState([]);
  const [entriesChange, setEntriesChange] = React.useState(true);
  const [boxWidth, setBoxWidth] = React.useState(0);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData(ENTRIES_KEY).then(data => {
        let tempEntries = JSON.parse(data);
        setEntries(tempEntries.slice(0, 20));

        // Get total salary and expense
        let salary = tempEntries
          .filter(item => item.value > 0)
          .reduce((x, y) => x + y.value, 0);
        let expense = -tempEntries
          .filter(item => item.value < 0)
          .reduce((x, y) => x + y.value, 0);
        setSaving(salary - expense);
        // Get month salary and expense
        let currentDay = new Date();
        let monthEntries = tempEntries.filter(item => {
          let parseDay = item.date.split('/').reverse();
          parseDay[1] -= 1;
          return isSameMonth(currentDay, new Date(...parseDay));
        });
        let month_salary = monthEntries
          .filter(item => item.value > 0)
          .reduce((x, y) => x + y.value, 0);
        let month_expense = -monthEntries
          .filter(item => item.value < 0)
          .reduce((x, y) => x + y.value, 0);
        setMonthlyGoal({
          current: month_salary - month_expense,
          total: 900,
        });
        setEntriesChange(false);
        setEntriesChange(true);
      });
    });
    return unsubscribe;
  }, [navigation]);
  let input = {
    goal_list: [
      {
        id: 1,
        name: 'Car',
        current: 100,
        total: 400,
      },
      {
        id: 2,
        name: 'Ipon',
        current: 300,
        total: 1000,
      },
      {
        id: 3,
        name: 'Ipon',
        current: 300,
        total: 1000,
      },
      {
        id: 4,
        name: 'Ipon',
        current: 300,
        total: 1000,
      },
      {
        id: 5,
        name: 'Ipon',
        current: 300,
        total: 1000,
      },
      {
        id: 6,
        name: 'Ipon',
        current: 300,
        total: 1000,
      },
    ],
  };
  const [data, setData] = React.useState(input);

  const renderItem = ({item, index}) => (
    <View
      style={{
        marginHorizontal: 20,
        borderTopColor: COLORS.primary,
        borderTopWidth: index == 0 ? 0 : 1,
      }}>
      <Text style={{...FONTS.h3, paddingVertical: 10}}>{item.name}</Text>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: (item.current / item.total) * boxWidth,
            flexDirection: 'row',
            justifyContent: 'center',
            borderTopColor: COLORS.primary,
            borderTopWidth: 5,
            borderTopEndRadius: 2,
            borderTopStartRadius: 2,
          }}>
          <Text style={{...FONTS.h3, padding: 10}}>${item.current}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            borderTopColor: COLORS.primary20,
            borderTopWidth: 5,
            borderTopEndRadius: 2,
          }}>
          <Text style={{...FONTS.h3, padding: 10}}>${item.total}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.safe}>
      {/* Current saving*/}
      {entriesChange && <Circle header={'Current Saving'} value={saving} />}
      {/* Money Goal box*/}
      {entriesChange && (
        <View style={{...styles.box, marginVertical: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <Image
              source={icons.calendar2}
              style={{width: 30, height: 30, marginHorizontal: 20}}
            />
            <Text style={{...FONTS.h2, textAlign: 'left', flex: 1}}>
              {format(new Date(), 'MMMM yyy')}
            </Text>
          </View>
          <Text style={{alignSelf: 'flex-start', margin: 20, ...FONTS.h3}}>
            Goal for this month
          </Text>
          <View
            onLayout={event => {
              var {width} = event.nativeEvent.layout;
              setBoxWidth(width);
            }}
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              borderRadius: 10,
              backgroundColor: COLORS.primary20,
              flexDirection: 'row',
            }}>
            <View
              style={{
                borderRadius: 10,
                width: (monthlyGoal.current / monthlyGoal.total) * boxWidth,
                backgroundColor: COLORS.primary,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text style={{...FONTS.h3, padding: 10}}>
                ${monthlyGoal.current}
              </Text>
            </View>
            <Text
              style={{...FONTS.h3, padding: 10, textAlign: 'center', flex: 1}}>
              ${monthlyGoal.total - monthlyGoal.current}
            </Text>
          </View>
        </View>
      )}
      {/* List Goal box*/}
      <View style={{...styles.box, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 10,
          }}>
          <Text style={{...FONTS.h2, textAlign: 'left', flex: 1}}>
            Your goals
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddGoal')}
            style={{
              width: 45,
              height: 45,
              backgroundColor: COLORS.primary20,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.plus}
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.primary,
              }}
            />
          </TouchableOpacity>
        </View>
        {data.goal_list.length > 0 && (
          <FlatList
            data={data.goal_list}
            renderItem={renderItem}
            keyExtractor={item => `${item.id}`}
            showsVerticalScrollIndicator={false}
          />
        )}

        {data.goal_list.length == 0 && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 100,
            }}>
            <Text style={{color: COLORS.primary, ...FONTS.h3}}>No Record</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Saving;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: COLORS.background1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  box: {
    padding: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
