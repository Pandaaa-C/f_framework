import {EventManager} from "./managers/event-manager";
import {PlayerPool} from "./managers/player-pool";
import {Vector3} from "../shared";

export class Core {
    readonly events = new EventManager();
    readonly players = new PlayerPool();
    readonly Vector3 = Vector3;
}