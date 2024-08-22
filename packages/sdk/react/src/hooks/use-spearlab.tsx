import { useContext } from "react";
import { SpearlabContext } from "../context";

export default function useSpearlab() {
	const context = useContext(SpearlabContext);

	if (!context) {
		throw new Error("useSpearlab must be used within SpearlabProvider");
	}

	return context;
}
