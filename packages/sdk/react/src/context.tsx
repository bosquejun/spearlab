/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext } from "react";
// @ts-ignore
import Hypercore from "hypercore";

export type SpearlabProviderConfig = {
	core?: string | Hypercore;
};

export type SpearlabContext = {
	config: SpearlabProviderConfig;
};

export const SpearlabContext = createContext<SpearlabContext | null>(null);
