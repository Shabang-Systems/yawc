import { useContext, useState, useEffect, Suspense } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { UserContext } from "./contexts.js";
import Load from "../components/load.jsx";
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLazyLoadQuery } from 'react-relay/hooks';

import ProjectsQuery from "./queries/__generated__/ProjectsQuery.graphql.js";
import ProjectsFragment from "./queries/__generated__/ProjectFragment.graphql.js";

const Stack = createNativeStackNavigator();

function Projects() {
    let projectsData = useLazyLoadQuery(ProjectsQuery, {});
    return (
        <View><Text>Hohohoh</Text></View>
    );
}

export default function WrappedMainWithNav() {
    const { gql } = useContext(UserContext);
    return (
        <RelayEnvironmentProvider environment={gql}>
            <Suspense fallback={<Load />}>
                <Stack.Navigator>
                    <Stack.Screen name="Projects" component={Projects} />
                </Stack.Navigator>
            </Suspense>
        </RelayEnvironmentProvider>
    );
}
