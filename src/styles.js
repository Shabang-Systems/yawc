import { StyleSheet } from 'react-native';

export default Styling = StyleSheet.create({
    vline: {
        height: "100%",
        width: 1,
        backgroundColor: "gray",
        opacity: 0.3
    },
    viewCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    viewFooter: {
        position: 'absolute', //Here is the trick
        bottom: 20, //Here is the trick
    },
    viewMainView: {
        // backgroundColor: "#fff",
        height: "100%"
    },
    viewTwoCol: {
        background: "red"
    },
    textHeading: {
        fontWeight: 800,
        fontSize: 20
    },
    textBox: {
        height: 30,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#e3e3e3",
        padding: 5  
    },
    buttonFilled: {
    }
});

