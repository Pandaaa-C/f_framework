import {EventManager} from "./managers/event-managers";
import {CommandManager} from "./managers/command-manager";
import {LocalPlayer} from "./entities/local-player";
import {Vector3} from "../shared";
import {registerInternalHandlers} from "./internal";

export class Core {
    readonly events = new EventManager();
    readonly commands = new CommandManager();
    readonly player = new LocalPlayer();
    readonly Vector3 = Vector3;

    constructor() {
        registerInternalHandlers();
    }
}