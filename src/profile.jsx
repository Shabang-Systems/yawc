import { useContext, useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { UserContext } from "./contexts.js";
import Styling from "./styles.js";
import { Button } from '@rneui/themed';
import { version } from '../package.json';

import dispatch from "./utils/dispatch.js";

export default function Profile() {
    const { key, logout } = useContext(UserContext);
    const [ userName, setUserName ] = useState("");

    useEffect(() => {
        (async () => {
            let query = await dispatch("username", key, {});
            setUserName(query.viewer.username);
        })();
    }, [key]);

    return (
        <SafeAreaView style={[Styling.viewMainView, Styling.viewCenter]}>
            <View style={{width: "min(80%, 40)"}}>
                <Text><Text style={[Styling.textHeading]}>YetAnotherWandbClient</Text> v{version}</Text>
                <Text>Please make an official mobile app :/</Text>
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
