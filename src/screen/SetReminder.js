import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import TextField from '../TextField';
import {icons, COLORS} from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {REMINDER_KEY, getData, saveData} from '../Storage';
import {format} from 'date-fns';
import PushNotification from "react-native-push-notification";


const SetReminder = ({navigation}) => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [contributeType, setContributeType] = useState('one');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    getData(REMINDER_KEY).then(data => {
      setReminders(JSON.parse(data));
    });
  }, []);

  const addReminder = () => {
    if (title == '') {
      Alert.alert('Error', 'Income Title is a required field.', [{text: 'Again'}]);
    }
    else if (amount <= 0) {
      Alert.alert('Error', 'Amount must be positive.', [{text: 'Again'}]);
    }
    else {
      let newID =
        reminders.length === 0 ? 1 : reminders[reminders.length - 1].id + 1;
      let newReminder = {
        id: newID,
        type: title,
        date: format(date, 'dd/MM/yyy'),
        value: parseFloat(amount),
        contribute: contributeType,
      };
      navigation.navigate('Reminder');
      reminders.push(newReminder);
      saveData(REMINDER_KEY, reminders);
      Alert.alert('Success', 'Reminder was added.', [{text: 'OK'}]);
      if (contributeType == 'one') {
        PushNotification.localNotificationSchedule({
          channelId: "reminder-channel",
          id: `${id}`,
          date: new Date(date.getFullYear(), date.getMonth(),date.getDate(), 9, 0, 0),
          allowWhileIdle: true,
          title: "You have to expense a bill.",
          message: newReminder.title + " need to be expensed",
          bigText: "You have to pay " + newReminder.value + "$ for " + newReminder.title,
        });
      }
      else {
        PushNotification.localNotificationSchedule({
          channelId: "reminder-channel",
          id: `${id}`,
          date: new Date(date.getFullYear(), date.getMonth(),date.getDate(), 9, 0, 0),
          allowWhileIdle: true,
          title: "You have to expense a bill.",
          message: newReminder.title + " need to be expensed",
          bigText: "You have to pay " + newReminder.value + "$ for " + newReminder.title,
          repeatType: contributeType,
        })
      }
    };
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const downImage = (
    <Image
      source={icons.down_arrow}
      style={{
        marginRight: 10,
        width: 12,
        height: 8,
        tintColor: 'black',
      }}
    />
  );
  const calendar = (
    <TouchableOpacity onPress={showDatepicker}>
      <Image
        source={icons.calendar2}
        style={{
          marginRight: 10,
          width: 20,
          height: 20,
          tintColor: 'black',
        }}
      />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.safe}>
      <TextField
        title={'Select Bill'}
        onChange={setTitle}
        placeholder="Select Bill"
      />
      <TextField
        title={'Amount'}
        onChange={setAmount}
        placeholder="Amount"
        keyboardType={'decimal-pad'}
        afterText={'$'}
      />
      <View style={{marginBottom: 20}}>
        <Text style={{...styles.texttitle, marginBottom: 20}}>Frequency</Text>
        <Picker
          mode={'dropdown'}
          selectedValue={contributeType}
          onValueChange={(itemValue, itemIndex) => setContributeType(itemValue)}
          style={{
            ...styles.shadow,
            padding: 10,
            backgroundColor: 'white',
          }}>
          <Picker.Item label="One Time" value='one' />
          <Picker.Item label="Every Day" value='day' />
          <Picker.Item label="Every Week" value='week' />
          <Picker.Item label="Every Month" value='month' />
        </Picker>
      </View>
      <TextField
        title={'Date'}
        placeholder={'Date'}
        afterImage={calendar}
        value={date.toDateString()}
        editable={'false'}
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <TouchableOpacity
        onPress={addReminder}
        style={{
          ...styles.loginBtn,
          alignSelf: 'center',
          marginTop: 50,
          ...styles.shadow,
        }}>
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
          Add Reminder
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SetReminder;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.background1,
    padding: 20,
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
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '69.5%',
    backgroundColor: '#3B3DBF',
    borderRadius: 15,
    height: 50,
    width: '60%',
  },
  texttitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});
