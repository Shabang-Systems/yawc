import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';
import ProfileQuery from "./queries/Profile.js";
import { UserContext, WandbContext, NavContext } from "./contexts.js";
import { Button, SafeAreaView, Text, View, FlatList, TouchableHighlight } from "react-native";
import Load from "../components/load.jsx";
import { Divider } from '@rneui/themed';

import Ionicons from '@expo/vector-icons/Ionicons';

import {ProjectsQuery, ProjectsQueryFragment} from "./queries/Projects.js";

import moment from "moment";

function ProjectsListItem( { item, navigation } ) {
    return (
        <TouchableHighlight
            onPress={() => {navigation.navigate('Project', {item: item.node } );}}>
            <View>
                <View style={{backgroundColor: "white",
                              padding: 13}}>
                    <View style={{display: 'flex', flexDirection: 'row',
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                 }}>
                        <View style={{display: 'flex', flexDirection: 'column'}}>
                            <Text style={{fontWeight: 500, paddingBottom: 3}}>{item.node.name}</Text>
                            <Text style={{fontWeight: 300, fontSize: 11}}>Last updated: {moment(item.node.updatedAt).fromNow()}</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', borderRadius: 3,
                                      padding: 3,
                                      backgroundColor: item.node.public ? "green" : "#f76d65"}}>
                            <Ionicons name={item.node.public ?
                                            "lock-open-outline" :
                                            "lock-closed-outline"}
                                      color={"white"}
                                      style={{transform: "translateY(2px)"}}
                            />
                            <Text style={{color: "white",
                                          fontWeight: 500,
                                          paddingLeft: 3}}>{item.node.public ? "Public" : "Private"}</Text>
                        </View>
                    </View>
                </View>
                <Divider />
            </View>
        </TouchableHighlight>
    );
}

function ProjectsList ( { projectsRef, refreshProjectsRef, navigation } ) {
    const [isPending, startTransition] = useTransition();

    const partial = usePreloadedQuery(ProjectsQuery, projectsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(ProjectsQueryFragment, partial);

    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={data.models.edges}
                renderItem={({item}) => <ProjectsListItem item={item} navigation={navigation} />}
                keyExtractor={item => item.node.id}
                onRefresh={() => startTransition(refreshProjectsRef)}
                refreshing={isPending}
                onEndReached={() => {if (hasNext) loadNext(10);}}
            />
        </View>
    );
}

export default function Projects( { profile, navigation } ) {
    const data = usePreloadedQuery(ProfileQuery, profile);
    const userName = data.viewer.username;

    const [ projectsQueryReference, loadQuery ] = useQueryLoader(ProjectsQuery);
    const { setEntity, setEntities} = useContext(WandbContext);

    useEffect(() => {
        loadQuery({ entity: userName });

        // TODO supprot third-party entities
        setEntity(userName);
        setEntities([userName]);
    }, []);

    return (
        <SafeAreaView style={{height: "100%"}}>
            <Suspense fallback={<Load/>}>
                <Divider />
                {/* <Text>Current Entity: {userName}</Text> */}
                {projectsQueryReference ? 
                 <ProjectsList
                     navigation={navigation}
                     projectsRef={projectsQueryReference}
                     refreshProjectsRef={() => { loadQuery({ entity: userName }); }}
                 />: <></>
                }
            </Suspense>
        </SafeAreaView>
    );
}
