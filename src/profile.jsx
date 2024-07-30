import { useContext, useState, useEffect, Suspense } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { UserContext } from "./contexts.js";
import Styling from "./styles.js";
import { Button } from '@rneui/themed';
import { version } from '../package.json';
import Load from "../components/load.jsx";

import ProfileQuery from "./queries/Profile.js";

import { useLazyLoadQuery } from 'react-relay/hooks';
import { RelayEnvironmentProvider } from 'react-relay/hooks';


function Profile() {
    const { logout } = useContext(UserContext);
    const data = useLazyLoadQuery(ProfileQuery, {});
    const userName = data.viewer.username;

    return (
        <SafeAreaView style={[Styling.viewMainView, Styling.viewCenter, {backgroundColor: "#fff"}]}>
            <View style={{width: "min(80%, 40)"}}>
                <Text><Text style={[Styling.textHeading]}>YetAnotherWandbClient</Text> v{version}</Text>
                <Text>Please make an official mobile app. ty!</Text>
                <View style={{marginTop: 20}}><Text style={{fontSize: 15}}>Logged in as:
                                                  <Text style={{fontWeight: 600}}> {userName}</Text></Text>
                </View>
                <Button
                    buttonStyle={{
                        backgroundColor: 'rgba(244, 244, 244, 1)'
                    }}
                    containerStyle={{marginTop: 60}}
                    titleStyle={{
                        marginHorizontal: 20,
                        color: 'black',
                        fontWeight: 500
                    }}
                    onPress={logout}>
                    Logout
                </Button>
            </View>
        </SafeAreaView>
    );
}

export default function WrappedProfile() {
    const { gql } = useContext(UserContext);

    return (
        <RelayEnvironmentProvider environment={gql}>
            <Suspense fallback={<Load />}>
                <Profile />
            </Suspense>
        </RelayEnvironmentProvider>
    );
}
