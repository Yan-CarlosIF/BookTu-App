import { useContext } from "react";

import { netInfoContext } from "../contexts/NetInfoContext";

export const useNetInfo = () => useContext(netInfoContext);
