import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import Ionicons from '@expo/vector-icons/Ionicons';

import moment from "moment";

import Styling from "../src/styles.js";

function getStatusColor(status) {
    if (status == "finished") {
        return "#528562";
    } else if (status == "running") {
        return "#818552";
    } else if (status == "crashed") {
        return "#b03e58";
    } else {
        return "red";
    }
}

function getStatusIcon(status) {
    if (status == "finished") {
        return "checkmark-done-outline";
    } else if (status == "running") {
        return "trending-up-outline";
    } else if (status == "crashed") {
        return "sad-outline";
    } else {
        return "help-outline";
    }
}

export default function RunStatus( { status } ) {
    return (
        <View style={{display: 'flex', flexDirection: 'row',
                      borderRadius: 3, padding: 3,
                      backgroundColor: getStatusColor(status)
                     }}>
            <Ionicons name={getStatusIcon(status)}
                      color={"white"}
                      style={{transform: "translateY(2px)"}}
            />
            <Text style={{color: "white",
                          fontWeight: 500,
                          paddingLeft: 3}}>{status}</Text>
        </View>

    );
}

