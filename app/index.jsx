import { useEffect, useState, useContext } from 'react';
import { View, Text, Button, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Styling from './styles.js';
import { UserContext } from "./contexts.js";
import { Icon } from '@rneui/themed';

import Auth from './auth.jsx';
import Profile from './profile.jsx';

const Stack = createNativeStackNavigator();

function Home( {navigation} ) {
    const { key, setKey, logout, setNavigator } = useContext(UserContext);

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
                    <NavigationContainer independent={true}>
                        <Stack.Navigator
                            sceneContainerStyle={{ overflow: 'visible' }}
                            cardStyle={{ backgroundColor: 'transparent' }}>
                            <Stack.Screen name="Home" component={Home} options={({navigation}) => {
                                return {
                                    headerRight: (() => (
                                        <Icon
                                            type={"simple-line-icon"}
                                            name={"settings"}
                                            color={Platform.OS == "ios" ? '#007AFF' : '#2196F3' }
                                            onPress={() => navigation.navigate("Settings")}
                                            style={{ paddingRight: Platform.OS == "ios" ? 0 : 20 }}
                                        />
                                    ))
                                };
                            }}/>
                            <Stack.Screen name="Settings" component={Profile} />
                        </Stack.Navigator>
                    </NavigationContainer>
                : ((apiKey == null) ?
                   <Auth setKey={setApiKey} /> :
                   <Load />
                  )
            }
        </UserContext.Provider>
    );
}


