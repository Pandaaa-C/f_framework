import {type IVector3, Vector3} from "../../shared";

export class Entity {
    constructor(public readonly handle: number) {
    }

    get exists(): boolean {
        return this.handle !== 0 && DoesEntityExist(this.handle);
    }

    get type(): number {
        return GetEntityType(this.handle);
    }

    get model(): number {
        return GetEntityModel(this.handle);
    }

    get netId(): number {
        return NetworkGetNetworkIdFromEntity(this.handle);
    }

    get owner(): number {
        return NetworkGetEntityOwner(this.handle);
    }

    get position(): Vector3 {
        const [x, y, z] = GetEntityCoords(this.handle);
        return new Vector3(x, y, z);
    }

    set position(v: IVector3) {
        SetEntityCoords(this.handle, v.x, v.y, v.z, false, false, false, false);
    }

    get rotation(): Vector3 {
        const [x, y, z] = GetEntityRotation(this.handle);
        return new Vector3(x, y, z);
    }

    set rotation(v: IVector3) {
        SetEntityRotation(this.handle, v.x, v.y, v.z, 2, false);
    }

    get heading(): number {
        return GetEntityHeading(this.handle);
    }

    set heading(value: number) {
        SetEntityHeading(this.handle, value);
    }

    get velocity(): Vector3 {
        const [x, y, z] = GetEntityVelocity(this.handle);
        return new Vector3(x, y, z);
    }

    set velocity(v: IVector3) {
        SetEntityVelocity(this.handle, v.x, v.y, v.z);
    }

    get rotationVelocity(): Vector3 {
        const [x, y, z] = GetEntityRotationVelocity(this.handle);
        return new Vector3(x, y, z);
    }

    get speed(): number {
        return GetEntitySpeed(this.handle);
    }

    get frozen(): boolean {
        return IsEntityPositionFrozen(this.handle);
    }

    set frozen(toggle: boolean) {
        FreezeEntityPosition(this.handle, toggle);
    }

    get health(): number {
        return GetEntityHealth(this.handle);
    }

    get maxHealth(): number {
        return GetEntityMaxHealth(this.handle);
    }

    get visible(): boolean {
        return IsEntityVisible(this.handle);
    }

    get collisionDisabled(): boolean {
        return GetEntityCollisionDisabled(this.handle);
    }

    get attachedTo(): number {
        return GetEntityAttachedTo(this.handle);
    }

    get populationType(): number {
        return GetEntityPopulationType(this.handle);
    }

    get script(): string {
        return GetEntityScript(this.handle);
    }

    get dimension(): number {
        return GetEntityRoutingBucket(this.handle);
    }

    set dimension(bucket: number) {
        SetEntityRoutingBucket(this.handle, bucket);
    }

    applyForce(
        force: IVector3,
        offset: IVector3 = {x: 0, y: 0, z: 0},
        forceType = 1,
    ): void {
        ApplyForceToEntity(
            this.handle,
            forceType,
            force.x,
            force.y,
            force.z,
            offset.x,
            offset.y,
            offset.z,
            0,
            false,
            true,
            true,
            false,
            true,
        );
    }

    distanceTo(v: IVector3): number {
        const p = this.position;
        const dx = p.x - v.x;
        const dy = p.y - v.y;
        const dz = p.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    delete(): void {
        DeleteEntity(this.handle);
    }
}