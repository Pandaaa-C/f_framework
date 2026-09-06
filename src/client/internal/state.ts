/// <reference types="@citizenfx/client" />

type StateGlobals = {
	Entity(entity: number): EntityInterface;
	Player(player: number | string): EntityInterface;
};

const g = globalThis as unknown as StateGlobals;

export const entityState = (handle: number): StateBagInterface =>
	g.Entity(handle).state;

export const playerState = (source: number | string): StateBagInterface =>
	g.Player(source).state;
