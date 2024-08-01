import { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { UserContext, WandbContext } from "./contexts.js";
import Load from "../components/load.jsx";
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLazyLoadQuery, useQueryLoader } from 'react-relay/hooks';
import ProfileQuery from "./queries/Profile.js";

import Projects from "./projects.jsx";
import Project from "./project.jsx";

const Stack = createNativeStackNavigator();

export default function WrappedMainWithNav() {
    const { gql } = useContext(UserContext);
    const [ profileQueryReference, loadQuery ] = useQueryLoader(ProfileQuery);

    const [ entity, setEntity ] = useState(null);
    const [ entities, setEntities ] = useState([]);

    useEffect(() => {
        loadQuery({});
    }, []);

    if (profileQueryReference) {
        return (
            <WandbContext.Provider value={{
                entity,
                entities,
                setEntity,
                setEntities
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
                </Stack.Navigator>
            </WandbContext.Provider>
        );
    } else return <></>;
}
