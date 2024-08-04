import { useEffect, useState, Suspense, useContext, useTransition, useRef, useCallback } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity, Platform } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import { RunsQuery, RunsQueryFragment } from "./queries/Runs.js";
import { RunQuery } from "./queries/Run.js";
import { HistoryQuery } from "./queries/History.js";

import Ionicons from '@expo/vector-icons/Ionicons';
import Load from "../components/load.jsx";
import RunStatus from "../components/runstatus.jsx";

import moment from "moment";

import Styling from "./styles.js";

import Svg, {Polyline} from 'react-native-svg';
import { cleanupKeys, generateHistorySamplingSpecs } from "./utils/history.js";

function stripData(data) {
    let result = [];
    for (let i of data) {
        let temp = [];
        let name = Object.keys(i[0]).filter(x => x != "_step")[0];
        for (let j of i) {
            temp.push(j[name]);
        }
        if (!temp.some(isNaN)) {
            result.push({
                key: name,
                values: temp
            });
        };
    }
    return result;
    
}

// to make sure that each item looks roughly the same
function normalize(item) {
    let data = item.values;
    let min = Math.min(...data);
    let max = Math.max(...data);
    let range = max-min;

    let normalized = data.map(x => range != 0 ? (x-min)/range : 1);;

    return normalized;
}

function Metric( {item, run, project, navigation} ) {
    let normalizedData = normalize(item);

    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate("Metric", {
                key: item.key,
                run, project
            });
        }}>
            <View
                style={{backgroundColor: "white",
                        marginLeft: 15, marginRight: 15,
                        marginBottom: 5,
                        marginTop: 4,
                        borderRadius: 7,
                        display: "flex", justifyContent: "center"
                       }} >
                <View style={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <View style={{flexGrow: 1, maxWidth: "60%", padding: 15}}>
                        <View style={{display: "flex",
                                      justifyContent: "center",
                                      paddingTop:10 
                                     }}>
                            <Text style={{fontWeight: 500}}
                                  numberOfLines={2}>{item.key}</Text>
                            <Text style={{fontFamily:
                                          Platform.OS === 'ios'
                                          ? 'Courier New' : 'monospace',
                                          paddingTop: 1.5
                                         }}>
                                last: {item.values[item.values.length-1].toPrecision(4)}
                            </Text>
                        </View>
                    </View>
                    <Svg height="80" width="150">
                        <Polyline
                            points={normalizedData.map((x, indx) =>
                                // we need to flip it because SVGs are
                                // from top to bottom
                                `${indx*2.75},${(1-x)*40+20}`).join(" ")}
                            fill="none"
                            stroke="#bfbfbf"
                            strokeWidth="1.5"
                        />
                    </Svg>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function MetricsTable( { qr, run, project, reload, navigation } ) {
    let data = usePreloadedQuery(HistoryQuery, qr);
    let strippedData = stripData(data.project.run.sampledHistory);
    
    let { entity, qrs } = useContext(WandbContext);
    
    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={strippedData}
                keyExtractor={item => {
                    return item.key;
                }}
                renderItem={({item: elem}) =>
                    <Metric item={elem} run={run}
                            project={project} navigation={navigation}/>}
                ListHeaderComponent={
                    <View>
                        <View style={{paddingLeft: 17, paddingRight: 20, paddingTop: 20,
                                      paddingBottom: 10, display: "flex",
                                      flexDirection: "row", alignItems: "center",
                                      width: "100%", justifyContent: "space-between"}}>
                            <Text style={{
                                fontWeight: 400,
                                color: "gray"
                            }}>
                                {project.name}/<Text style={{fontWeight: 700}}>{run.displayName}</Text>
                            </Text>

                            <View style={{display: "flex", flexDirection: "row"}}>
                                <Text style={{
                                    fontWeight: 600,
                                    color: "gray"
                                }}>
                                    {strippedData.length} metric{strippedData.length != 1 ? 's  ': '  '}

                                </Text>
                                <TouchableOpacity onPress={reload}>
                                    <View style={{transform: "translateY(1px)"}}>
                                        <Ionicons name="reload-outline"
                                                size={14} color={"gray"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            />
        </View>
    );
}

export default function Metrics( { navigation, route }) {
    let { qrs } = useContext(WandbContext);
    const [ historyQueryReference, loadHistory ] = useQueryLoader(HistoryQuery);

    let run = route.params.run;
    let project = route.params.project;

    const loadHistoryCallback = useCallback(() => {
        let keys = Object.keys(cleanupKeys(run.historyKeys));
        let request = {
            entity: project.entity,
            project: project.name,
            run: run.name,
            specs: generateHistorySamplingSpecs(keys, 50)
        };

        loadHistory(request, {fetchPolicy: 'network-only'});
    });



    useEffect(() => {
        loadHistoryCallback();
    }, []);

    return (
        <SafeAreaView style={{height: "100%"}}>
            <Suspense fallback={<Load/>}>
                {historyQueryReference ? <MetricsTable
                                             navigation={navigation}
                                             qr={historyQueryReference}
                                             run={route.params.run}
                                             project={route.params.project}
                                             reload={loadHistoryCallback}
                                         />
                 : <Load/>}
            </Suspense>
        </SafeAreaView>
    );
}
