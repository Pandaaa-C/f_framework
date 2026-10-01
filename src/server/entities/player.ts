import {type IVector3, Net, Vector3} from "../../shared";
import {playerState} from "../internal/state";
import {serverRpc} from "../managers/rpc";
import {Ped} from "./ped";
import {PlayerWeapons} from "./player-weapons";
import {Vehicle} from "./vehicle";

export class Player {
    constructor(public readonly source: number) {
    }

    private h(value: string | number): number {
        return typeof value === "string" ? GetHashKey(value) : value;
    }

    get name(): string {
        return GetPlayerName(String(this.source));
    }

    get ped(): Ped {
        return new Ped(GetPlayerPed(String(this.source)));
    }

    get position(): Vector3 {
        return this.ped.position;
    }

    get rotation(): Vector3 {
        return this.ped.rotation;
    }

    get heading(): number {
        return this.ped.heading;
    }

    get velocity(): Vector3 {
        const [x, y, z] = GetEntityVelocity(this.ped.handle);
        return new Vector3(x, y, z);
    }

    get speed(): number {
        return GetEntitySpeed(this.ped.handle);
    }

    get health(): number {
        return this.ped.health;
    }

    get armour(): number {
        return this.ped.armour;
    }

    get maxArmour(): number {
        return GetPlayerMaxArmour(String(this.source));
    }

    get maxHealth(): number {
        return GetPlayerMaxHealth(String(this.source));
    }

    get dead(): boolean {
        return this.health <= 0;
    }

    get ping(): number {
        return GetPlayerPing(String(this.source));
    }

    get ip(): string {
        return GetPlayerEndpoint(String(this.source));
    }

    get lastMsg(): number {
        return GetPlayerLastMsg(String(this.source));
    }

    get model(): number {
        return GetEntityModel(this.ped.handle);
    }

    set model(model: string | number) {
        SetPlayerModel(String(this.source), this.h(model));
    }

    get identifiers(): Record<string, string> {
        const out: Record<string, string> = {};
        const count = GetNumPlayerIdentifiers(String(this.source));
        for (let i = 0; i < count; i++) {
            const id = GetPlayerIdentifier(String(this.source), i);
            const idx = id.indexOf(":");
            if (idx !== -1) out[id.slice(0, idx)] = id.slice(idx + 1);
        }
        return out;
    }

    getIdentifier(prefix: string): string | undefined {
        const key = prefix.endsWith(":") ? prefix.slice(0, -1) : prefix;
        return this.identifiers[key];
    }

    isAceAllowed(object: string): boolean {
        return IsPlayerAceAllowed(String(this.source), object);
    }

    get vehicle(): Vehicle | undefined {
        const veh = GetVehiclePedIsIn(this.ped.handle, false);
        return veh !== 0 ? new Vehicle(veh) : undefined;
    }

    get seat(): number {
        return GetSeatPedIsUsing(this.ped.handle);
    }

    get isInVehicle(): boolean {
        return IsPedInAnyVehicle(this.ped.handle);
    }

    get isRagdoll(): boolean {
        return IsPedRagdoll(this.ped.handle);
    }

    get isHandcuffed(): boolean {
        return IsPedHandcuffed(this.ped.handle);
    }

    get isInvincible(): boolean {
        return GetPlayerInvincible(String(this.source));
    }

    get wantedLevel(): number {
        return GetPlayerWantedLevel(String(this.source));
    }

    get dimension(): number {
        return GetPlayerRoutingBucket(String(this.source));
    }

    set dimension(bucket: number) {
        SetPlayerRoutingBucket(String(this.source), bucket);
    }

    getVariable<T = unknown>(key: string): T | undefined {
        return playerState(String(this.source))[key] as T | undefined;
    }

    setVariable(key: string, value: unknown): void {
        playerState(String(this.source)).set(key, value, true);
    }

    setHealth(value: number): void {
        emitNet(Net.setHealth, this.source, value);
    }

    setArmour(value: number): void {
        emitNet(Net.setArmour, this.source, value);
    }

    setPosition(v: IVector3): void {
        emitNet(Net.setPosition, this.source, v.x, v.y, v.z);
    }

    setRotation(v: IVector3): void {
        emitNet(Net.setRotation, this.source, v.x, v.y, v.z);
    }

    setInvincible(toggle: boolean): void {
        SetPlayerInvincible(String(this.source), toggle);
    }

    setWantedLevel(level: number): void {
        SetPlayerWantedLevel(String(this.source), level, false);
    }

    clearWantedLevel(): void {
        this.setWantedLevel(0);
    }

    setComponent(
        componentId: number,
        drawable: number,
        texture: number,
        palette = 0,
    ): void {
        SetPedComponentVariation(
            this.ped.handle,
            componentId,
            drawable,
            texture,
            palette,
        );
    }

    setProp(propId: number, drawable: number, texture: number): void {
        SetPedPropIndex(this.ped.handle, propId, drawable, texture, true);
    }

    warpIntoVehicle(vehicle: Vehicle | number, seat = -1): void {
        const veh = typeof vehicle === "number" ? vehicle : vehicle.handle;
        TaskWarpPedIntoVehicle(this.ped.handle, veh, seat);
    }

    setIntoVehicle(vehicle: Vehicle | number, seat = -1): void {
        const veh = typeof vehicle === "number" ? vehicle : vehicle.handle;
        SetPedIntoVehicle(this.ped.handle, veh, seat);
    }

    leaveVehicle(flags = 0): void {
        const veh = GetVehiclePedIsIn(this.ped.handle, false);
        if (veh !== 0) TaskLeaveVehicle(this.ped.handle, veh, flags);
    }

    clearTasks(immediately = false): void {
        if (immediately) ClearPedTasksImmediately(this.ped.handle);
        else ClearPedTasks(this.ped.handle);
    }

    get weapons(): PlayerWeapons {
        return new PlayerWeapons(this);
    }

    notify(message: string): void {
        emitNet(Net.notify, this.source, message);
    }

    spawn(coords: IVector3, heading = 0): void {
        emitNet(Net.spawn, this.source, coords.x, coords.y, coords.z, heading);
    }

    call(name: string, ...args: any[]): void {
        emitNet(name, this.source, ...args);
    }

    callProc<T = unknown>(name: string, ...args: unknown[]): Promise<T> {
        return serverRpc.call<T>(this.source, name, args);
    }

    kick(reason = "Kicked"): void {
        DropPlayer(String(this.source), reason);
    }

    ban(reason = "Banned"): void {
        emit("fivex:playerBanned", this.source, this.identifiers, reason);
        DropPlayer(String(this.source), reason);
    }

    drop(reason: string): void {
        DropPlayer(String(this.source), reason);
    }
}