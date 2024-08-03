import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import {RunsQuery, RunsQueryFragment} from "./queries/Runs.js";

import Ionicons from '@expo/vector-icons/Ionicons';
import Load from "../components/load.jsx";

import moment from "moment";

import Styling from "./styles.js";

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

function RunStatus( { status } ) {
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

function RunItem( {run} ) {
    return (
        <View style={{backgroundColor: "white",
                      marginLeft: 14, marginRight: 14,
                      marginBottom: 5,
                      marginTop: 4,
                      borderRadius: 7,
                      padding: 15, height: 60,
                      display: "flex", justifyContent: "center"
                     }}>
            <View style={{display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "row"}}>
                <View style={{display: "flex", flexDirection: "row",
                              alignItems: "center", maxWidth: "40%"}}>
                    <View style={{width: 90, display: "flex",
                                  flexDirection: "row",
                                  paddingRight: 14, justifyContent: "flex-end"}}>
                        <RunStatus status={run.state} />
                    </View>
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <Text>{run.displayName}</Text>
                        <Text style={{
                            fontWeight: 600,
                            fontSize: 10,
                            color: "gray",
                            paddingTop: 2 
                        }}>{moment(run.heartbeatAt).fromNow()}</Text>
                    </View>
                </View>
                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity underlayColor="transparent" onPress={()=>{alert(run.id+"GRAPH"+run.displayName);}}>
                        <View style={{marginRight: 12}}>
                            <Ionicons
                                name={"bar-chart"}
                                color={"#a8a8a8"}
                                style={{fontSize: 20}}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={[Styling.vline]}></View>
                    <TouchableOpacity onPress={()=>{alert(run.id+"INFO"+run.displayName);}}>
                        <View style={{marginLeft: 12}}>
                            <Ionicons
                                name={"information-circle-outline"}
                                color={"#8c8c8c"}
                                style={{fontSize: 20}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function RunsList ( { runsRef, refreshRunRef, navigation, header, item } ) {
    const [isPending, startTransition] = useTransition();

    const partial = usePreloadedQuery(RunsQuery, runsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(RunsQueryFragment, partial);

    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={data.project.runs.edges}
                renderItem={({item: run}) => <RunItem run={run.node}/>}
                keyExtractor={item => item.node.id}
                onRefresh={() => startTransition(refreshRunRef)}
                refreshing={isPending}
                onEndReached={() => {if (hasNext) loadNext(10);}}
                ListFooterComponent={<View style={{height: 20}}></View>}
                ListHeaderComponent={
                    <View>
                        <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20,
                                      paddingBottom: 15, display: "flex",
                                      flexDirection: "row", alignItems: "center",
                                      width: "100%", justifyContent: "space-between"}}>
                            <Text style={{
                                fontWeight: 600,
                                color: "gray"
                            }}>
                                <Text>{item.runActiveCount}</Text> (running)
                                <Text style={{fontSize: 16}}> / </Text>
                                <Text>{item.runCount}</Text> (total)
                            </Text>
                            <Text style={{
                                transform: "translateY(1px)",
                                fontWeight: 600,
                                color: "gray",
                                paddingLeft: 10
                            }}>
                                {moment.duration(item.computeHours, "seconds").humanize()} of compute
                            </Text>
                        </View>
                    </View>
                }
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
            
            {/* <Text>Current Entity: {userName}</Text> */}
            {runsQueryReference ? 
             <RunsList
                 item = {item}
                 navigation={navigation}
                 runsRef={runsQueryReference}
                 refreshRunRef={() => { loadQuery({ entity, name: item.name }); }}
             />: <Load />
            }
        </SafeAreaView>
    );
}
