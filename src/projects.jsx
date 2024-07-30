import { useEffect, useState, Suspense, useContext, useTransition } from 'react';
import { usePreloadedQuery, useQueryLoader, usePaginationFragment } from 'react-relay';
import ProfileQuery from "./queries/Profile.js";
import { UserContext, WandbContext, NavContext } from "./contexts.js";
import { Button, SafeAreaView, Text, View } from "react-native";
import Load from "../components/load.jsx";

import ProjectsQuery from "./queries/Projects.js";
import ProjectsQueryFragment from "./queries/ProjectsQueryFragment.js";

function ProjectsList ( { projectsRef } ) {
    const [isPending, startTransition] = useTransition();
    const partial = usePreloadedQuery(ProjectsQuery, projectsRef);
    const {data, loadNext, hasNext} = usePaginationFragment(ProjectsQueryFragment, partial);

    const onLoadMore = () => startTransition(() => {
        loadNext(3);
    });

    return (
        <View>
            {data.models.edges.map(edge => {
                return (<Text key={edge.node.id}>{edge.node.name}</Text>);
            })}
            <Button title={hasNext ? (isPending ? "patience" : "yeh"): "nah"}
                    disabled={isPending || !hasNext}
                    onPress={onLoadMore}
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
            <SafeAreaView style={{margin: 10}}>
                <Text>Current Entity: {userName}</Text>
        {projectsQueryReference ? 
         <ProjectsList projectsRef={projectsQueryReference}/>: <></>
        }
            </SafeAreaView>
        </WandbContext.Provider>
    );
}
