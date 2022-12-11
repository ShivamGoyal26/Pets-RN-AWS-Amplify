import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Pets from '../screens/Pets';
import UpdatePet from '../screens/UpdatePet';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="Pets"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Pets" component={Pets} />
        <Stack.Screen name="UpdatePet" component={UpdatePet} />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
