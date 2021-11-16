import React from 'react';
import {StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Button } from "react-native";

const Reminder = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="SetReminder"
          onPress={() => navigation.navigate('SetReminder')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Reminder;

export const styles=StyleSheet.create({
    safe: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});