/* @flow */

import strategies from "./storage/strategies/keyvalue";

let _store = {};

function store(name: string, serializer: Object, store: Storage): void {
    Object.defineProperty(_store, name, {
        enumerable: true,
        get: () => serializer.thaw(store.getItem(name)),
        set: (value) => store.setItem(serializer.freeze(value)),
    })
}

const length = {
    freeze: (value) => `${value}`,
    thaw: (frozen) => parseInt(frozen) || 0,
}

const string = {
    freeze: (value) => value,
    thaw: (value) => value,
}

const json = {
    freeze: (value) => JSON.stringify(value),
    thaw: (frozen) => JSON.parse(value)
}

store("historyLength", length, strategies.session);
store("location",       string, strategies.session);
store("coordinates",     json, strategies.session);

{
    "historyLength":           strategies.session,
    "location":                strategies.session,
    "coordinates":             strategies.session,

    "age":                     strategies.persistent,
    "demographics":            json, strategies.persistent,
    "gender":                  strategies.persistent,
    "sleep-tonight":           strategies.persistent,
    "sub-addiction":           strategies.persistent,
    "sub-advocacy":            strategies.persistent,
    "sub-advocacy-complaints": strategies.persistent,
    "sub-counselling":         strategies.persistent,
    "sub-everyday-things":     strategies.persistent,
    "sub-health":              strategies.persistent,
    "sub-housing":             strategies.persistent,
    "sub-job":                 strategies.persistent,
    "sub-legal":               strategies.persistent,
    "sub-life-skills":         strategies.persistent,
    "sub-money":               strategies.persistent,
    "sub-technology":          strategies.persistent,
}

export default {

    get historyLength(): number {
        return strategies.session.getItem("historyLength");
    }

    setHistoryLength(value: number): void {
        strategies.session.setItem("historyLength", value);
    }

}
