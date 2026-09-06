import {EventManager} from "./managers/event-manager";
import {PlayerPool} from "./managers/player-pool";
import {Vector3} from "../shared";
import {BlipManager} from "./blips";

export class Core {
    readonly events = new EventManager();
    readonly players = new PlayerPool();
    readonly Vector3 = Vector3;
    readonly blips = new BlipManager();
}