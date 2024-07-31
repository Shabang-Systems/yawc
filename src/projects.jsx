import { useEffect, useState, Suspense, useContext, useTransition, useRef } from 'react';
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';
import ProfileQuery from "./queries/Profile.js";
import { UserContext, WandbContext, NavContext } from "./contexts.js";
import { Button, SafeAreaView, Text, View, FlatList, Pressable } from "react-native";
import Load from "../components/load.jsx";
import { Divider } from '@rneui/themed';

import Ionicons from '@expo/vector-icons/Ionicons';

import ProjectsQuery from "./queries/Projects.js";
import ProjectsQueryFragment from "./queries/ProjectsQueryFragment.js";

import moment from "moment";

function ProjectsList ( { projectsRef, refreshProjectsRef } ) {
    const [isPending, startTransition] = useTransition();

    const partial = usePreloadedQuery(ProjectsQuery, projectsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(ProjectsQueryFragment, partial);

    return (
        <View>
            <FlatList
                style={{height: "100%"}}
                data={data.models.edges}
                renderItem={({item}) => {
                    return (
                        <Pressable>
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
                        </Pressable>
                    );
                }}
                keyExtractor={item => item.node.id}
                onRefresh={() => startTransition(refreshProjectsRef)}
                refreshing={isPending}
                onEndReached={() => {if (hasNext) loadNext(10);}}
            />
        </View>
    );
}

export default function Projects( { profile } ) {
    const data = usePreloadedQuery(ProfileQuery, profile);
    const userName = data.viewer.username;

    const [ projectsQueryReference, loadQuery ] = useQueryLoader(ProjectsQuery);

    useEffect(() => {
        loadQuery({ entity: userName });
    }, []);

    return (
        <WandbContext.Provider value={{
            entity: userName,
            entities: [userName],
            /* TODO allow third-party entities */
        }}>
            <SafeAreaView>
                <Divider />
                {/* <Text>Current Entity: {userName}</Text> */}
                {projectsQueryReference ? 
                 <ProjectsList
                     projectsRef={projectsQueryReference}
                     refreshProjectsRef={() => { loadQuery({ entity: userName }); }}
                 />: <></>
                }
            </SafeAreaView>
        </WandbContext.Provider>
    );
}
