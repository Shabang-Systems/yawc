import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableHighlight } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import {RunsQuery, RunsQueryFragment} from "./queries/Runs.js";

function RunsList ( { runsRef, refreshRunRef, navigation } ) {
    const [isPending, startTransition] = useTransition();

    const partial = usePreloadedQuery(RunsQuery, runsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(RunsQueryFragment, partial);

    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={data.project.runs.edges}
                renderItem={({item}) => <View><Text>{item.node.displayName}</Text></View>}
                keyExtractor={item => item.node.id}
                onRefresh={() => startTransition(refreshRunRef)}
                refreshing={isPending}
                onEndReached={() => {if (hasNext) loadNext(10);}}
            />
        </View>
    );
}

export default function Project( { navigation, route } ) {
    const item = route.params.item;
    const { entity } = useContext(WandbContext);

    const [ runsQueryReference, loadQuery ] = useQueryLoader(RunsQuery);

    useEffect(() => {
        loadQuery({ entity, name: item.name });
    }, []);

    return (
        <SafeAreaView>
            <View>
                <Text></Text>
            </View>
            <Divider />
            {/* <Text>Current Entity: {userName}</Text> */}
            {runsQueryReference ? 
             <RunsList
                 navigation={navigation}
                 runsRef={runsQueryReference}
                 refreshRunsRef={() => { loadQuery({ entity, name: item.name }); }}
             />: <></>
            }
        </SafeAreaView>
    );
}
