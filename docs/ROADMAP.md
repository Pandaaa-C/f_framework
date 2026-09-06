## Phase 1 — Core plumbing

The stuff everything else depends on. Do this first.

- `[ ]` **Unify `addCommand`** onto `fx.events` on both client and server; retire the separate client `CommandManager`. Client handler `(args, raw)`, server handler `(player | null, args, raw)`.
- `[ ]` **Typed event map (shared).** A single interface describing every net event's payload, threaded through `addNet` / `call` / `callRemote` so payloads infer instead of `any[]`. This is the feature that makes the framework better than untyped RAGEMP — build it early so later phases get typed events for free.
    - Shared: `interface NetEvents { 'fivex:ready': []; 'fivex:notify': [message: string]; ... }`
    - Server/Client: generic `addNet<K extends keyof NetEvents>(name: K, handler: (...args: NetEvents[K]) => void)`.
- `[ ]` **RPC layer** (`mp.events.addProc` / `callProc`, `player.callProc`). FiveM has no request/response; build it on paired net events with a request id and a pending-promise map. Belongs alongside the event managers.
    - Server: `fx.events.addProc(name, handler)`, `player.callProc(name, ...args): Promise<T>`.
    - Client: `fx.events.addProc(name, handler)`, `fx.events.callRemoteProc(name, ...args): Promise<T>`.
- `[ ]` **Entity variables / synced data** (`entity.setVariable` / `getVariable`, `entity.data`). RAGEMP syncs these automatically; FiveM's native equivalent is **state bags** (`Entity(handle).state`, `Player(source).state`, `setStateBagValue`). Wrap state bags behind a `getVariable`/`setVariable` API so it feels like RAGEMP but rides the native sync.
- `[ ]` **Dimensions** (`entity.dimension`). FiveM's equivalent is **routing buckets** (`SetPlayerRoutingBucket`, `SetEntityRoutingBucket`). Map `dimension` onto buckets so the RAGEMP mental model works.

## Phase 2 — Entities and pools

Generalize what the client already has and give the server real entity handling.

- `[ ]` **Entity base parity.** Round out both sides' `Entity` with the common surface: `model`, `position`, `rotation`, `heading`, `dimension`, `alpha`, `dist` / `distSquared`, `destroy`, `getVariable` / `setVariable`. Client can go much deeper (the native wrapper surface is huge) — cover the common 20%, not all of it.
- `[ ]` **netId ↔ handle resolution.** RAGEMP entities have a stable `id` / `remoteId`; FiveM uses network ids. Add `entity.netId` (via `NetworkGetNetworkIdFromEntity`) and a pool `atRemoteId` / `atNetId` (via `NetworkGetEntityFromNetworkId`). This is how client and server refer to the same entity.
- `[ ]` **Generic pool base** (`mp.<pool>` — `at`, `exists`, `forEach`, `toArray`, `getClosest`, `length`). Factor the player-pool logic into a reusable base so vehicles/objects/peds get the same interface.
- `[ ]` **Vehicle pool + server spawn.** `fx.vehicles.new(model, pos, ...)` server-side. This is a genuine server-creatable networked entity in FiveM (`CreateVehicle` server native under OneSync), unlike blips — so it's a real pool, not orchestration.
- `[ ]` **Ped / Object pools.** Server-creatable networked entities too (`CreatePed`, `CreateObject` server natives). Same pool base.
- `[ ]` **Client streaming awareness** (`forEachInStreamRange`, `streamed` arrays). Client-only concept — which networked entities are currently streamed in.

## Phase 3 — World objects (the orchestration layer)

Everything here is client-draw-only in FiveM. Each one repeats the blip pattern: server registry + broadcast add/remove + late-join `syncTo`. Build them on a shared base so you write the sync loop once.

- `[~]` **Blips** (`mp.blips`). Coord blips done in design; wire in. Then entity blips (`AddBlipForEntity`, follows a ped/vehicle by netId), route blips, categories.
- `[ ]` **Markers** (`mp.markers`). The 3D world markers (cylinders, arrows). Client draws each tick; server registry decides which exist and for whom.
- `[ ]` **Checkpoints** (`mp.checkpoints`). Similar; often paired with a colshape for the "entered" event.
- `[ ]` **Text labels** (`mp.labels`). 3D floating text. Pure client draw + server registry.
- `[ ]` **Colshapes** (`mp.colshapes` — circle, sphere, cuboid, tube). **Big FiveM divergence:** RAGEMP colshapes are server-side and fire `playerEnterColshape` / `playerExitColshape` automatically. FiveM has no server colshape natives. Implement as a shared shape definition + client-side point-in-shape test each tick that emits enter/exit up to the server. Server keeps the registry and re-fires the framework-level events.
- `[ ]` **Pickups** (`mp.pickups`). Orchestration + a colshape for the pickup trigger.

## Phase 4 — Player and Vehicle depth

The two entities people touch most. Broad surfaces — prioritize what a server actually uses.

- `[ ]` **Player server API** (`player.*`): `kick`, `ban`, `notify`, `outputChatBox` (done), `spawn`, `giveWeapon` / `removeWeapon` / `removeAllWeapons`, appearance (`setClothes`, `setCustomization`, `setHeadBlend`, `setHeadOverlay`, `setFaceFeature`). Appearance writes are client-authoritative under OneSync — route through the owning client like health.
- `[ ]` **Player state reads** (`player.health`, `armour`, `ping`, `ip`, `vehicle`, `seat`, plus the `isX` state checks). Reads are fine server-side.
- `[ ]` **Vehicle API** (`vehicle.*`): `repair`, `explode`, `spawn`, colors (`setColor` / `setColorRGB`), `numberPlate`, `mods` (`getMod` / `setMod`), `neonColor`, `livery`, `engine`, `locked`, `getOccupants`. Mix of server-settable (networked entity props) and client-authoritative (visual) — check per property.
- `[ ]` **Weapons** helper grouping (`giveWeapon`, ammo, current weapon).

## Phase 5 — Client subsystems

Client-only namespaces with no server equivalent. These are where "client feels complete."

- `[ ]` **`fx.game.*`** (`mp.game.*`). The native-category wrappers: `graphics`, `gameplay`, `ui`, `audio`, `cam`, `controls`, `streaming`, `ped`, `vehicle`, `weapon`, etc. Large but mechanical — these are thin groupings over native categories and can largely be generated. Cover `graphics`, `ui`, `controls`, `streaming` first.
- `[ ]` **NUI / browser** (`mp.browser`). FiveM's CEF equivalent is NUI: `SendNUIMessage`, `RegisterNUICallback`, `SetNuiFocus`. Wrap as `fx.nui` — `send`, `on`, `focus`. Different enough from RAGEMP's `Browser` class that it's a translation, not a port. High value for any UI work.
- `[ ]` **Keys** (`mp.keys.bind` / `unbind`). FiveM uses `RegisterKeyMapping` + commands, or per-tick `IsControlPressed`. Wrap both — mapping for rebindable, tick-poll for raw.
- `[ ]` **Camera** (`mp.cameras`). Custom camera class: create, `setActive`, `pointAt`, interpolation, shake, DOF. Client-only, big but self-contained.
- `[ ]` **Cursor** (`mp.gui.cursor`) — show/visible/position. **Raycasting** (`mp.raycasting`) — thin wrapper over `StartShapeTestRay` / `GetShapeTestResult`. **Nametags** (`mp.nametags`) — the per-tick draw loop over streamed players.
- `[ ]` **Local storage** (`mp.storage`). Persistent local client data. FiveM: `GetResourceKvpString` / `SetResourceKvp` KVP store. Wrap as `fx.storage`.

## Phase 6 — World and global

- `[ ]` **World** (`mp.world`): `time` (hour/minute/set), `weather` / `setWeatherTransition`, `requestIpl` / `removeIpl`, traffic lights. Time and weather are client natives, so server-side control is orchestration (broadcast + late-join sync), same pattern as Phase 3.
- `[ ]` **Hashing** (`mp.joaat`). `GetHashKey` native. Available both sides — expose `fx.joaat(str)` on each Core (can't be pure-shared since it's a native, but the signature is identical).
- `[ ]` **Config** (`mp.config`) — expose read-only server settings where FiveM has equivalents (`GetConvar`).
