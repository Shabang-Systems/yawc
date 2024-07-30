import { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { UserContext } from "./contexts.js";
import Load from "../components/load.jsx";
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLazyLoadQuery, useQueryLoader } from 'react-relay/hooks';
import ProfileQuery from "./queries/Profile.js";

import Projects from "./projects.jsx";

const Stack = createNativeStackNavigator();

export default function WrappedMainWithNav() {
    const { gql } = useContext(UserContext);
    const [ profileQueryReference, loadQuery ] = useQueryLoader(ProfileQuery);

    useEffect(() => {
        loadQuery({});
    }, []);

    if (profileQueryReference) {
        return (
            <Stack.Navigator initialRouteName="Projects">
                <Stack.Screen name="Projects">
                    {({navigation}) => {
                        return <Projects profile={profileQueryReference} {...navigation} />;
                    }}
                </Stack.Screen>
            </Stack.Navigator>
        );
    } else return <></>;
}
