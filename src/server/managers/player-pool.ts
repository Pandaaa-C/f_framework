import { Player } from "../entities/player";

export class PlayerPool {
	at(source: number): Player {
		return new Player(source);
	}
	toArray(): Player[] {
		return (getPlayers() as string[]).map((s) => new Player(Number(s)));
	}
	forEach(fn: (p: Player) => void): void {
		this.toArray().forEach(fn);
	}
	call(name: string, ...args: any[]): void {
		emitNet(name, -1, ...args);
	}
}
