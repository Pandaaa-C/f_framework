import { Ped } from "./ped";
import { PlayerWeapons } from "./player-weapons";
import { Vehicle } from "./vehicle";

export class LocalPlayer extends Ped {
	constructor() {
		super(PlayerPedId());
	}

	get handle() {
		return PlayerPedId();
	}

	get serverId(): number {
		return GetPlayerServerId(PlayerId());
	}

	get currentVehicle(): Vehicle | null {
		const veh = GetVehiclePedIsIn(this.handle, false);
		return veh !== 0 ? new Vehicle(veh) : null;
	}

	get weapons(): PlayerWeapons {
		return new PlayerWeapons(this);
	}
}
