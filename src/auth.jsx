import { useState, useContext } from 'react';
import { View, Text, TextInput, SafeAreaView,
         KeyboardAvoidingView, Platform, Keyboard,
         TouchableWithoutFeedback, Pressable, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/themed';
import Styling from './styles.js';

import { UserContext } from "./contexts.js";

export default function Auth({ setKey }) {
    const [apiKey, setApiKey] = useState('');

    return (
        <KeyboardAvoidingView
            style={[Styling.viewCenter]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={{width: "70%"}}>
                <Text style={[Styling.textHeading]}>Hello!</Text>
                <Text style={{fontSize: 20}}>Let's get authenticated.</Text>
                <View style={{marginTop: 20}}>
                    <TextInput
                        style={[Styling.textBox]}
                        placeholder="wandb api key"
                        value={apiKey}
                        onChangeText={setApiKey}
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                    />
                    <Pressable>
                        <Button
                            buttonStyle={{
                                backgroundColor: 'rgba(244, 244, 244, 1)'
                            }}
                            containerStyle={{marginTop: 20}}
                            titleStyle={{
                                marginHorizontal: 20,
                                color: 'black',
                                fontWeight: 500
                            }}
                            onPress={async () => {
                                await AsyncStorage.setItem('api-key', apiKey.trim());
                                setKey(apiKey.trim());
                            }}
                        >
                            Confirm
                        </Button>
                    </Pressable>
                </View>
            </SafeAreaView>
            <View style={[Styling.viewFooter]}>
                <Text
                    style={{fontSize: 10, color: "gray"}}>
                    Your API Key only travels to wandb.ai.</Text>
            </View>
        </KeyboardAvoidingView>
    );
}


