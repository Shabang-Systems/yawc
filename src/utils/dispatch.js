import {Environment, Network, RecordSource, Store} from 'relay-runtime';

const API = "https://api.wandb.ai/graphql";

async function dispatch(query, variables, api_key) {
    let res = await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("api" + ":" + api_key)
        },
        body: JSON.stringify({
            query: query.text,
            variables: variables
        }),
    });
    let data = (await res.json());
    return data;
}

export function buildGQL(api_key) {
    let env = new Environment({
        network: Network.create(async (query, variables) => await dispatch(query, variables, api_key)),
        store: new Store(new RecordSource())
    });

    return env;
}



