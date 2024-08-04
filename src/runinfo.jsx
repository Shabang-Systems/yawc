import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { Button, SafeAreaView, Text, View, FlatList, TouchableOpacity, StyleSheet, ScrollView  } from "react-native";
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';

import { Divider } from '@rneui/themed';

import { WandbContext } from "./contexts.js";

import Ionicons from '@expo/vector-icons/Ionicons';
import Load from "../components/load.jsx";

import moment from "moment";

import { RunQuery } from "./queries/Run.js";
import Styling from "./styles.js";
import RunStatus from "../components/runstatus.jsx";

import JSONTree from 'react-native-json-tree';

import theme from "./codetheme.js";

const styles = StyleSheet.create({
    TableRow: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: 13,
    },
    TableLeft: {
        textAlign: "right",
        color: "gray",
        fontWeight: 600,
        fontSize: 13,
        paddingRight: 10,
        width: "45%",
        transform: "translateY(0.75px)"
    },
    TableRight: {
        flexGrow: 1,
        width: "50%",
        fontSize: 14,
        transform: "translateY(0.15px)"
    }

});

function clean_config(x) {
    delete x["_wandb"];
    let fixed = {};
    for (const [key, value] of Object.entries(x)) {
        // ignore desc
        fixed[key] = value.value;
    }
    return fixed;
}

function RunInfoTable( { qr } )  {
    let data = usePreloadedQuery(RunQuery, qr);
    let run = data.project.run;

    return (
        <View style={{backgroundColor: "white", height: "100%"}}>
            <View style={{paddingTop: 20}}>
                <View style={[styles.TableRow, {marginBottom: 10}]}>
                    <Text style={[styles.TableLeft,
                                  {transform: "translateY(1px)"}]}>Status</Text>
                    <Text style={[styles.TableRight]}><RunStatus status={run.state}/></Text>
                </View>
                <View  style={[styles.TableRow]}>
                    <Text style={[styles.TableLeft]}>Created</Text>
                    <Text style={[styles.TableRight]}>{run.createdAt}</Text>
                </View>
                <View  style={[styles.TableRow]}>
                    <Text style={[styles.TableLeft]}>Last Heartbeat</Text>
                    <Text style={[styles.TableRight]}>{moment(run.createdAt).fromNow()}</Text>
                </View>
                <View style={[styles.TableRow]}>
                    <Text style={[styles.TableLeft]}>Host</Text>
                    <Text style={[styles.TableRight]}>{run.host}</Text>
                </View>
                <View style={[styles.TableRow]}>
                    <Text style={[styles.TableLeft]}>Description</Text>
                    <Text style={[styles.TableRight]}>{run.description}</Text>
                </View>
            </View>
            <View style={{padding: 13, paddingTop: 5}}>
                <Text style={{color: "gray",
                              fontSize: 13,
                              paddingBottom: 1,
                              paddingLeft: 5,
                              fontWeight: 600}}>Configuration</Text>
                <ScrollView style={{height: "80%"}}>
                    <JSONTree data={clean_config(JSON.parse(run.config))} theme={theme} />
                    <View style={{height: 30}}></View>
                </ScrollView>
            </View>
        </View>
    );
}

export default function RunInfo( { navigation, route } ) {
    const item = route.params.item;
    const ref = route.params.runsRef;
    const { qrs } = useContext(WandbContext);

    const [runInfo, setRunInfo] = useState(null);

    useEffect(() => {
        if (qrs.RunInfo) {
            setRunInfo(qrs.RunInfo);
        }
    }, [qrs]);

   return (
       <SafeAreaView style={{height: "100%", width: "100%", backgroundColor: "white"}}>
            { (runInfo) ? <RunInfoTable qr={runInfo}/> : <Load />}
        </SafeAreaView>
    );
}
