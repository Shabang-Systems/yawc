const X_AXIS = "_step";

function cleanupKeys(d) {
    // for now, remove gradient and system keys
    // we can figure out something to do with them #later
    // TODO
    let results = {};

    for (const [key, value] of Object.entries(d.keys)) {
        if (!(key.startsWith("system") ||
              key.startsWith("gradients") ||
              key.startsWith("params") ||
              key.startsWith("_"))) {
            results[key] = value.previousValue;
        }
    }

    return results;
}

function generateHistorySamplingSpecs(keys, samples) {
    let specs = [];
    for (let i of keys) {
        specs.push(JSON.stringify({"keys": [X_AXIS, i], "samples": samples}));
    }
    return specs;
}

export { cleanupKeys, generateHistorySamplingSpecs };
