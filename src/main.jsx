import { useContext, useState, useEffect } from 'react';
import { Button, SafeAreaView, Text, View } from "react-native";
import { UserContext, WandbContext } from "./contexts.js";
import Load from "../components/load.jsx";
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLazyLoadQuery, useQueryLoader } from 'react-relay/hooks';
import ProfileQuery from "./queries/Profile.js";

import Metric from "./metric.jsx";
import Metrics from "./metrics.jsx";
import Projects from "./projects.jsx";
import Project from "./project.jsx";
import RunInfo from "./runinfo.jsx";
import * as ScreenOrientation from 'expo-screen-orientation';

const Stack = createNativeStackNavigator();

export default function WrappedMainWithNav() {
    const { gql } = useContext(UserContext);
    const [ profileQueryReference, loadQuery ] = useQueryLoader(ProfileQuery);

    const [ entity, setEntity ] = useState(null);
    const [ entities, setEntities ] = useState([]);
    const [ qrs, setQrs ] = useState({
    });

    useEffect(() => {
        (async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        })();
        loadQuery({});
    }, []);

    if (profileQueryReference) {
        return (
            <WandbContext.Provider value={{
                entity,
                entities,
                setEntity,
                setEntities,
                qrs,
                setQrs
                /* TODO allow third-party entities */
            }}>

                <Stack.Navigator initialRouteName="Projects">
                    <Stack.Screen name="Projects">
                        {({navigation}) => {
                            return <Projects profile={profileQueryReference} navigation={navigation} />;
                        }}
                    </Stack.Screen>
                    <Stack.Screen name="Project"
                                  component={Project}
                                  options={
                                      ({ route }) => ({ title: route.params.item.name })
                                  }/>
                    <Stack.Screen name="Metrics" component={Metrics} />
                    <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Stack.Screen name="Metric" component={Metric}
                                  options={
                                      ({ route }) => ({
                                          title: route.params.key,
                                          headerShown: false,
                                          animation: 'none',
                                          orientation: 'all'
                                      })
                                  }
                    />
                    </Stack.Group>

                    <Stack.Group screenOptions={{ presentation: 'modal' }}>
                        <Stack.Screen name="RunInfo"
                                      component={RunInfo}
                                      options={
                                          ({ route, navigation }) => {
                                              return {
                                                  title: route.params.item.displayName,
                                                  headerRight: () => (<Button title="Done" onPress={navigation.goBack} />)
                                              };
                                          }
                                      }/>
                    </Stack.Group>
                </Stack.Navigator>
            </WandbContext.Provider>
        );
    } else return <></>;
}
