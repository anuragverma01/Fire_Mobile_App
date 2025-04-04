import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from '../App/Screen/SplashScreen';
import CustomHeader from '../App/Compoment/CustomHeader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ErrorScreen from '../App/Screen/ErrorScreen';
import useNetworkStatus from '../App/Context/NetworkProvider';
import ActiveFireMapScreen from '../App/Screen/ActiveFireMapScreen';
import PredictionFireMapScreen from '../App/Screen/PredictionFireMapScreen';
import PredictionFireList from '../App/Screen/PredictionFireList';
import ActiveFireList from '../App/Screen/ActiveFireList';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ActiveStack = createStackNavigator();
const PredictionStack = createStackNavigator();

const ActiveFireStackScreen: React.FC = () => (
  <ActiveStack.Navigator>
    <ActiveStack.Screen
      name="ActiveFireMain"
      options={{ headerTitle: () => <CustomHeader title="Active Fire Map" /> }}
      component={ActiveFireMapScreen}
    />
    <ActiveStack.Screen
      name="ActiveList"
      options={{ headerTitle: () => <CustomHeader title="Active Fire List" /> }}
      component={ActiveFireList}
    />
  </ActiveStack.Navigator>
);
const PredictionFireStackScreen: React.FC = () => (
  <PredictionStack.Navigator>
    <PredictionStack.Screen
      name="PredictionFireMain"
      options={{ headerTitle: () => <CustomHeader title="Prediction Fire Map" /> }}
      component={PredictionFireMapScreen}
    />
    <PredictionStack.Screen
      name="PredictionList"
      options={{ headerTitle: () => <CustomHeader title="Prediction Fire List" /> }}
      component={PredictionFireList}
    />
  </PredictionStack.Navigator>
);

const TabNavigator: React.FC = () => (
  <Tab.Navigator
    initialRouteName='ActiveFire'
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;
        if (route.name === 'ActiveFire') {
          iconName = focused ? 'fire' : 'fire-alt';
        } else if (route.name === 'PredictionFire') {
          iconName = focused ? 'fire' : 'fire-alt';
        }
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e91e63',
      tabBarInactiveTintColor: 'black',
    })}
  >
    <Tab.Screen name="ActiveFire" component={ActiveFireStackScreen} options={{ headerShown: false }} />
    <Tab.Screen name="PredictionFire" component={PredictionFireStackScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const MainNavigator: React.FC = () => {
  const isOnline = useNetworkStatus();
  useEffect(() => {
    console.log("Network status changed:", isOnline);
  }, [isOnline]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isOnline === null ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : isOnline ? (
        <Stack.Screen name="Home" component={TabNavigator} />
      ) : (
        <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
      )}
    </Stack.Navigator>
  );
};

const Route: React.FC = () => (
  <NavigationContainer>
    <MainNavigator />
  </NavigationContainer>
);
export default Route;