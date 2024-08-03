import { createContext } from "react";

const UserContext = createContext({
    key: null,
    setKey: (x) => {},
    logout: async () => {}
});

const WandbContext = createContext({
    entity: null,
    entities: [],
    setEntity: () => {},
    setEntities: () => {},
    qrs: null,
    setQrs: () => {},
});


export { UserContext, WandbContext };
