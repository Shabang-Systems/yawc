import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableHighlight } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { WandbContext } from "./contexts.js";

import ProfileQuery from "./queries/Profile.js";

export default function Project( { navigation, route } ) {
    const item = route.params.item;
    const { entity } = useContext(WandbContext);

    return (
        <View><Text>{item.name}: {item.id} - {entity}</Text></View>
    );
}
