/// <reference types="@citizenfx/server" />

import {Net} from "../../shared";
import {Entity} from "./entity";

type VehicleOp =
    | "repair"
    | "explode"
    | "setMod"
    | "toggleMod"
    | "setNeon"
    | "setNeonColour"
    | "setLivery"
    | "setEngineOn";

export class Vehicle extends Entity {
    private runOnOwner(op: VehicleOp, ...args: unknown[]): void {
        const owner = NetworkGetEntityOwner(this.handle);
        if (owner === -1) return;
        emitNet(Net.vehicleOp, owner, this.netId, op, args);
    }

    get driver(): number {
        return GetPedInVehicleSeat(this.handle, -1);
    }

    getPedInSeat(seat: number): number {
        return GetPedInVehicleSeat(this.handle, seat);
    }

    getOccupants(maxSeats = 16): { seat: number; ped: number }[] {
        const out: { seat: number; ped: number }[] = [];
        for (let seat = -1; seat < maxSeats; seat++) {
            const ped = GetPedInVehicleSeat(this.handle, seat);
            if (ped !== 0) out.push({seat, ped});
        }
        return out;
    }

    get bodyHealth(): number {
        return GetVehicleBodyHealth(this.handle);
    }

    set bodyHealth(v: number) {
        SetVehicleBodyHealth(this.handle, v);
    }

    get engineHealth(): number {
        return GetVehicleEngineHealth(this.handle);
    }

    get tankHealth(): number {
        return GetVehiclePetrolTankHealth(this.handle);
    }

    get numberPlate(): string {
        return GetVehicleNumberPlateText(this.handle);
    }

    set numberPlate(text: string) {
        SetVehicleNumberPlateText(this.handle, text);
    }

    get vehicleType(): string {
        return GetVehicleType(this.handle);
    }

    get totalRepairs(): number {
        return GetVehicleTotalRepairs(this.handle);
    }

    get model(): number {
        return GetEntityModel(this.handle);
    }

    get livery(): number {
        return GetVehicleLivery(this.handle);
    }

    get dirtLevel(): number {
        return GetVehicleDirtLevel(this.handle);
    }

    set dirtLevel(v: number) {
        SetVehicleDirtLevel(this.handle, v);
    }

    get windowTint(): number {
        return GetVehicleWindowTint(this.handle);
    }

    get colours(): [number, number] {
        return GetVehicleColours(this.handle) as unknown as [number, number];
    }

    setColours(primary: number, secondary: number): void {
        SetVehicleColours(this.handle, primary, secondary);
    }

    get customPrimaryColour(): [number, number, number] {
        return GetVehicleCustomPrimaryColour(this.handle) as unknown as [
            number,
            number,
            number,
        ];
    }

    setCustomPrimaryColour(r: number, g: number, b: number): void {
        SetVehicleCustomPrimaryColour(this.handle, r, g, b);
    }

    get customSecondaryColour(): [number, number, number] {
        return GetVehicleCustomSecondaryColour(this.handle) as unknown as [
            number,
            number,
            number,
        ];
    }

    setCustomSecondaryColour(r: number, g: number, b: number): void {
        SetVehicleCustomSecondaryColour(this.handle, r, g, b);
    }

    get extraColours(): [number, number] {
        return GetVehicleExtraColours(this.handle) as unknown as [number, number];
    }

    get engineRunning(): boolean {
        return GetIsVehicleEngineRunning(this.handle);
    }

    get handbrake(): boolean {
        return GetVehicleHandbrake(this.handle);
    }

    get locked(): boolean {
        return GetVehicleDoorLockStatus(this.handle) === 2;
    }

    get owner(): number {
        return NetworkGetEntityOwner(this.handle);
    }

    setDoorsLocked(locked: boolean): void {
        SetVehicleDoorsLocked(this.handle, locked ? 2 : 1);
    }

    setDoorBroken(doorIndex: number, deleteDoor = false): void {
        SetVehicleDoorBroken(this.handle, doorIndex, deleteDoor);
    }

    setAlarm(active: boolean): void {
        SetVehicleAlarm(this.handle, active);
    }

    repair(): void {
        this.runOnOwner("repair");
    }

    explode(): void {
        this.runOnOwner("explode");
    }

    setMod(type: number, index: number): void {
        this.runOnOwner("setMod", type, index);
    }

    toggleMod(type: number, on: boolean): void {
        this.runOnOwner("toggleMod", type, on);
    }

    setNeon(index: number, on: boolean): void {
        this.runOnOwner("setNeon", index, on);
    }

    setNeonColour(r: number, g: number, b: number): void {
        this.runOnOwner("setNeonColour", r, g, b);
    }

    setLivery(index: number): void {
        this.runOnOwner("setLivery", index);
    }

    setEngineOn(on: boolean): void {
        this.runOnOwner("setEngineOn", on);
    }
}
