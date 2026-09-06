import type { IVector3 } from "./math/vector3";

export interface BlipData {
	id: number;
	coords: IVector3;
	sprite?: number;
	color?: number;
	scale?: number;
	label?: string;
	shortRange?: boolean;
}

export const BlipNet = {
	add: "__fx:blip:add",
	remove: "__fx:blip:remove",
	sync: "__fx:blip:sync",
} as const;
