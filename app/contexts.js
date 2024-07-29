import { createContext } from "react";

const UserContext = createContext({
    key: null,
    setKey: (x) => {},
    logout: async () => {}
});

export { UserContext };
