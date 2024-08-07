import { registerRootComponent } from 'expo';

import { useEffect, useState, useContext, Suspense } from 'react';
import { View, Text, Button, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styling from './src/styles.js';
import { UserContext } from "./src/contexts.js";
import { Icon } from '@rneui/themed';

import Ionicons from '@expo/vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import Auth from './src/auth.jsx';
import Profile from './src/profile.jsx';
import Main from './src/main.jsx';
import Load from './components/load.jsx';

import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { buildGQL } from "./src/utils/dispatch.js";

function App() {
    // null: not set; False: not loaded; value: api key
    const [apiKey, setApiKey] = useState(false);
    const [gql, setGql] = useState(null);

    useEffect(() => {
        (async () => {
            const key = await AsyncStorage.getItem('api-key');
            setApiKey(key);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setGql(apiKey ? buildGQL(apiKey) : null);
        })();
    }, [apiKey]);

    return (
        <UserContext.Provider value={{
            key: apiKey,
            setKey: setApiKey,
            gql,
            logout: async () => {
                await AsyncStorage.removeItem("api-key");
                setApiKey(null);
            }}}
        >
            {
                (apiKey && gql) ?
                    <NavigationContainer>
                            <Tab.Navigator
                                sceneContainerStyle={{ overflow: 'visible' }}
                                cardStyle={{ backgroundColor: 'transparent' }}>
                                <Tab.Screen name="Home"
                                            options={{
                                                tabBarIcon: ({ focused, color, size }) => (
                                                    <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color}/>
                                                ),
                                                headerShown: false
                                            }}
                                >
                                    {() => (
                                        <RelayEnvironmentProvider environment={gql}>
                                            <Suspense fallback={<Load/>}>
                                                <Main />
                                            </Suspense>
                                        </RelayEnvironmentProvider>
                                    )}
                                </Tab.Screen>
                                <Tab.Screen
                                    name="Settings"
                                    component={Profile}
                                    options={{ tabBarIcon: ({ focused, color, size }) => (
                                        <Ionicons name="cog" size={size} color={color}/>
                                    )}}
                                />
                            </Tab.Navigator>
                    </NavigationContainer>
                : ((apiKey == null) ?
                   <Auth setKey={setApiKey} /> :
                   <Load />
                  )
            }
        </UserContext.Provider>
    );
}



export default registerRootComponent(App);
