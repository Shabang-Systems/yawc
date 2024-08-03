import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import { RunsQuery, RunsQueryFragment } from "./queries/Runs.js";
import { RunQuery } from "./queries/Run.js";

import Ionicons from '@expo/vector-icons/Ionicons';
import Load from "../components/load.jsx";
import RunStatus from "../components/runstatus.jsx";

import moment from "moment";

import Styling from "./styles.js";

function RunItem( { run, navigation, project } ) {
    const [ runQueryReference, loadQuery ] = useQueryLoader(RunQuery);

    const { qrs, setQrs } = useContext(WandbContext);
    useEffect(() => {
        let qrp = qrs;
        qrp["RunInfo"] = runQueryReference;

        setQrs(qrp);
    }, [runQueryReference]);

    return (
        <View style={{backgroundColor: "white",
                      marginLeft: 14, marginRight: 14,
                      marginBottom: 5,
                      marginTop: 4,
                      borderRadius: 7, height: 60,
                      display: "flex", justifyContent: "center"
                     }}>
            <View style={{display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "row"}}>
                <View style={{display: "flex", flexDirection: "row",
                              alignItems: "center", maxWidth: "40%",
                              paddingLeft:15 
                             }}>
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
                    <TouchableOpacity
                        style={{flexGrow: 1, width: 50}}
                        underlayColor="transparent" onPress={()=>{alert(run.id+"GRAPH"+run.displayName);}}>
                        <View style={{height: "100%",
                                      display: "flex", alignItem: "center", justifyContent: "center"}}>
                            <Ionicons
                                name={"bar-chart"}
                                color={"#a8a8a8"}
                                style={{fontSize: 20, paddingLeft: 13}}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={[Styling.vline]}></View>
                    <TouchableOpacity
                        style={{flexGrow: 1, width: 50}}
                        onPress={()=>{
                            loadQuery({entity: project.entity,
                                       project: project.name,
                                       run: run.name});
                            navigation.navigate("RunInfo", { item: run });
                        }}>
                        <View style={{height: "100%",
                                      display: "flex", alignItem: "center", justifyContent: "center"}}>
                            <Ionicons
                                name={"information-circle-outline"}
                                color={"#8c8c8c"}
                                style={{fontSize: 20, paddingLeft: 13, paddingTop: 1}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function RunsList ( { runsRef, refreshRunRef, navigation, header, item, project } ) {
    const [isPending, startTransition] = useTransition();

    const partial = usePreloadedQuery(RunsQuery, runsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(RunsQueryFragment, partial);

    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={data.project.runs.edges}
                renderItem={({item: run}) => <RunItem run={run.node} navigation={navigation} project={project}/>}
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
                 project={{entity, name: item.name }}
                 refreshRunRef={() => { loadQuery({ entity, name: item.name }); }}
             />: <Load />
            }
        </SafeAreaView>
    );
}
