import { useEffect, useState, Suspense, useContext, useTransition, useRef, useCallback } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity, Platform, processColor } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import { RunsQuery, RunsQueryFragment } from "./queries/Runs.js";
import { RunQuery } from "./queries/Run.js";
import { HistoryQuery } from "./queries/History.js";

import Ionicons from '@expo/vector-icons/Ionicons';
import Load from "../components/load.jsx";
import RunStatus from "../components/runstatus.jsx";
import {LineChart} from 'react-native-charts-wrapper';

import moment from "moment";

import Styling from "./styles.js";

import Svg, {Polyline} from 'react-native-svg';
import { cleanupKeys, generateHistorySamplingSpecs } from "./utils/history.js";

const getKey = (raw) => Object.keys(raw[0]).filter(x => x != "_step")[0];

function BuildDataset(raw) {
    let steps = [];
    let values = [];
    let ticks = [];

    let name = getKey(raw);
    for (const i of raw) {
        let step = i["_step"];
        let value = i[name];
        ticks.push(step);
        values.push(value);
        steps.push({x: step, y: value});
    }

    return {ds: steps, steps: ticks, values, name};
}

function mean(x) {
    // I can't believe this doesn't exist
    return x.reduce((a, b) => a + b, 0)/x.length;
}

function range(x) {
    // I can't believe this doesn't exist
    return Math.max(...x)-Math.min(...x);
}

function MetricView({ navigation, qr, run }) {
    let data = usePreloadedQuery(HistoryQuery, qr);
    let {ds, steps, values, name} = BuildDataset(data.project.run.sampledHistory[0]);
    
    return (
        <View style={{backgroundColor: "white", height: "100%"}}>
            <LineChart
                legend={{verticalAlignment: "TOP"}}
                style={{flex: 1}}
                xAxis={{
                    position: "BOTTOM",
                    axisMaximum: Math.max(...steps)+0.1*range(steps),
                    axisMinimum: Math.min(...steps)-0.1*range(steps),
                    avoidFirstLastClipping: true,
                }}
                yAxis={{right: {enabled: false}}}
                dragDecelerationEnabled={true}
                data={{dataSets:[{
                    label: run.displayName,
                    values: ds,
                    config: {
                        drawValues: false,
                        lineWidth: 1.5,
                        color: processColor("#434d5f"),
                        drawCircles: false,
                        drawHighlightIndicators: false,
                        drawFilled: false,
                    }
                }]}}
            />
            <View style={{margin: 10, marginTop: 20, height: "6%"}}>
                <Text>we were youngggg bb</Text>
            </View>
            {/* <Button title="no" onPress={() => {navigation.goBack();}}/> */}
        </View>
    );
}

export default function Metric({navigation, route}) {
    let {run, project, key} = route.params;

    const [ historyQueryReference, loadHistory ] = useQueryLoader(HistoryQuery);

    const loadHistoryCallback = useCallback(() => {
        let request = {
            entity: project.entity,
            project: project.name,
            run: run.name,
            specs: generateHistorySamplingSpecs([key], 500)
        };

        loadHistory(request, {fetchPolicy: 'network-only'});
    });


    useEffect(() => {
        loadHistoryCallback();
    }, []);

    return (
        <SafeAreaView style={{height: "100%", backgroundColor: "white"}}>
            <Suspense fallback={<Load/>}>
                {historyQueryReference ? <MetricView
                                             navigation={navigation}
                                             run={run}
                                             qr={historyQueryReference}
                                             project={project}
                                             reload={loadHistoryCallback}
                                         />
                 : <Load/>}
            </Suspense>
        </SafeAreaView>
    );
}
