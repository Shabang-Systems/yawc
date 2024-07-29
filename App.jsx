import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styling from './src/styles.js';
import { UserContext } from "./src/contexts.js";
import { Icon } from '@rneui/themed';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import Auth from './src/auth.jsx';
import Profile from './src/profile.jsx';

function Home( {navigation} ) {
    const { key, setKey, logout } = useContext(UserContext);

    return (
        <View style={[Styling.viewMainView]}>
            <Text>HAWO {key}</Text>
            {/* <Button onPress={logout} title="hi" /> */}
        </View>
    );
}

function Load() {
    return (
        <View style={[Styling.viewCenter]}>
            <Text style={{marginBottom: 20}}>Fetching context, hang on tight.</Text>
            <ActivityIndicator/>
        </View>
    );
}

export default function App() {
    // null: not set; False: not loaded; value: api key
    const [apiKey, setApiKey] = useState(false);

    useEffect(() => {
        (async () => {
            const key = await AsyncStorage.getItem('api-key');
            setApiKey(key);
        })();
    }, []);

    return (
        <UserContext.Provider value={{
            key: apiKey,
            setKey: setApiKey,
            /* setNavigator: setNavigate, */
            logout: async () => {
                await AsyncStorage.removeItem("api-key");
                setApiKey(null);
            }}}
        >
            {
                apiKey ?
                    <NavigationContainer>
                        <Tab.Navigator
                            sceneContainerStyle={{ overflow: 'visible' }}
                            cardStyle={{ backgroundColor: 'transparent' }}>
                            <Tab.Screen name="Home" component={Home}/>
                            <Tab.Screen name="Settings" component={Profile} />
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


