import { View, Text, ActivityIndicator } from 'react-native';

export default function Load() {
    return (
        <View style={[Styling.viewCenter]}>
            <Text style={{marginBottom: 20}}>Fetching data, hang on tight.</Text>
            <ActivityIndicator/>
        </View>
    );
}
