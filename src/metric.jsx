import { useEffect, useState, Suspense, useContext, useTransition, useRef, useCallback } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity, Pressable, Platform, processColor } from "react-native";
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

import Slider from '@react-native-community/slider';
import moment from "moment";

import Styling from "./styles.js";

import Svg, {Polyline} from 'react-native-svg';
import { cleanupKeys, generateHistorySamplingSpecs } from "./utils/history.js";
import * as ScreenOrientation from 'expo-screen-orientation';

const getKey = (raw) => Object.keys(raw[0]).filter(x => x != "_step")[0];

// https://stackoverflow.com/questions/20811131/javascript-remove-outlier-from-an-array
function calculateOutliers(someArray) {  
    var values = someArray.concat();
    values.sort( function(a, b) {
            return a - b;
         });
    var q1 = values[Math.floor((values.length / 4))];
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;
    var maxValue = q3 + iqr*1;
    var minValue = q1 - iqr*1;
    return [maxValue, minValue];
}

// https://stackoverflow.com/questions/40057020/calculating-exponential-moving-average-ema-using-javascript
function EMACalc(mArray,mRange) {
    let k = 2/(mRange + 1);
    // first item is just the same as the first item in the input
    let emaArray = [mArray[0]];
    // for the rest of the items, they are computed with the previous one
    for (var i = 1; i < mArray.length; i++) {
        emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
    }
    return emaArray;
}

function BuildDataset(raw, ignoreOutliers, ema) {
    let steps = [];
    let values = [];
    let ticks = [];

    let name = getKey(raw);

    let [max, min] = calculateOutliers(raw.map(x=>x[name]));

    for (const i of raw) {
        let step = i["_step"];
        let value = i[name];
        if (!ignoreOutliers || (value >= min && value <= max)) {
            ticks.push(step);
            values.push(value);
            steps.push({x: step, y: value});
        }
    }

    if (ema != 0) {
        values = EMACalc(values, ema);
        steps = steps.map((i, indx) => ({x: i.x, y: values[indx]}));
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

function MetricView({ navigation, qr, run, reload }) {
    let data = usePreloadedQuery(HistoryQuery, qr);

    let [ignoreOutliers, setIgnoreOutliers] = useState(false);
    let [ema, setEMA] = useState(0);

    let {ds, steps, values, name} = BuildDataset(data.project.run.sampledHistory[0],
                                                 ignoreOutliers, ema);
    
    return (
        <View style={{backgroundColor: "white", height: "100%",
                      padding: 20, paddingBottom: 0, paddingTop: 25}}>
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
            <View style={{margin: 10, marginTop: 10}}>
                <View style={{display: "flex",
                              padding: 20,
                              paddingBottom: 5,
                              flexDirection: "row",
                                alignItems: "center",
                              justifyContent: "space-between"}}>
                    <View style={{display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "flex-start"}}>
                        <Pressable
                            style={{backgroundColor: "#f0f0f0",
                                    borderRadius: 5,
                                    padding: 5,
                                    display: "inline-block"}}
                            onPress={reload}>
                            <Ionicons name="reload"
                                      color={"#4d4d4d"}
                                      size={17}/>
                        </Pressable>
                        
                        <Pressable
                            style={{backgroundColor: ignoreOutliers ? "#9c9c9c" : "#f0f0f0",
                                    borderRadius: 5,
                                    padding: 5,
                                    marginLeft: 10,
                                    display: "inline-block"}}
                            onPress={() => {setIgnoreOutliers(!ignoreOutliers);}}>
                            <Ionicons name="chevron-expand"
                                      color={ignoreOutliers ? "white" : "#4d4d4d"}
                                      size={17}/>
                        </Pressable>
                        
                        <Slider
                            style={{width: "60%", height: 3, marginLeft: 15}}
                            minimumValue={0}
                            maximumValue={50}
                            step={1}
                            onValueChange={(v) => setEMA(v)}
                            value={ema}
                        />
                    </View>
                    <TouchableOpacity
                        style={{backgroundColor: "#f0f0f0",
                                borderRadius: 5,
                                padding: 5,
                                display: "inline-block"}}
                        onPress={() => {navigation.goBack();}}>
                        <Ionicons name="close" color={"#4d4d4d"} size={17}/>
                    </TouchableOpacity>
                </View>
            </View>
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
        (async () => {
            await ScreenOrientation.unlockAsync();
        })();
        loadHistoryCallback();

        return () => {
            (async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            })();
        };
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
