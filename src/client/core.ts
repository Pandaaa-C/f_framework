import { BlipManager } from "../server/blips";
import { Vector3 } from "../shared";
import { registerBlipHandlers } from "./blips-internal";
import { LocalPlayer } from "./entities/local-player";
import { registerInternalHandlers } from "./internal";
import { EventManager } from "./managers/event-manager";

export class Core {
	readonly events = new EventManager();
	readonly player = new LocalPlayer();
	readonly Vector3 = Vector3;
	readonly blips = new BlipManager();

	constructor() {
		registerInternalHandlers();
		registerBlipHandlers();
	}
}
