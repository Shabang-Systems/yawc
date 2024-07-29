import queries from "./queries.json";
const API = "https://api.wandb.ai/graphql";

export default async function dispatch(query, api_key, variables) {
    let res = await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa("api" + ":" + api_key)
        },
        body: JSON.stringify({
            query: queries[query],
            variables: variables
        }),
    });
    let data = (await res.json()).data;

    return data;
}




