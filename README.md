# fivex

A TypeScript framework for FiveM. You install it into a resource project like any npm package and get a consistent, object-oriented API over the natives instead of calling them raw in every script.

`fx.events.add`, `fx.events.addCommand`, a player pool, entity objects, and a real `Vector3` class with math on it. The difference is that everything is typed.

> Package name is `@panda0day/fivex` and the global export is `fx`. Rename to taste before publishing.

## How it works

FiveM never loads `node_modules` at runtime. The client runtime is a V8 isolate with no module resolution, and server scripts run as a single bundled file. So this framework isn't loaded by FiveM directly — it's a normal library that your resource's bundler (esbuild) inlines into your `client.js` / `server.js` at build time.

That's the whole reason it "works the same in every project": FiveM only ever sees the final bundle, and your framework code is baked into it.

Because client and server expose different natives, the package has three entry points:

```
@panda0day/fivex/client   // client-only API + shared
@panda0day/fivex/server   // server-only API + shared
@panda0day/fivex/shared   // Vector3, math, event names — no natives
```

Importing `/client` can never pull server natives onto the client, and vice versa.

## Install

```bash
npm install @panda0day/fivex
```

You also need the CitizenFX typings in your project (they're peer dependencies):

```bash
npm install -D @citizenfx/client @citizenfx/server
```

## Quick start

Client:

```ts
import { fx, Vector3 } from '@panda0day/fivex/client';

fx.events.addCommand('up', () => {
  fx.player.position = fx.player.position.add(new Vector3(0, 0, 5));
});

fx.events.addNet('fivex:notify', (message: string) => {
  console.log(message);
});
```

Server:

```ts
import { fx } from '@panda0day/fivex/server';

fx.events.addCommand('kickall', () => {
  fx.players.forEach((p) => p.drop('server reset'));
});

fx.events.addNet('fivex:ready', (player) => {
  player.outputChatBox(`Welcome, ${player.name}`);
  fx.players.broadcast(`${player.name} joined`);
});
```

Natives are still global functions, so anything the framework doesn't wrap you just call directly:

```ts
const ped = PlayerPedId();
SetPedArmour(ped, 100);
```

## Events

Local events stay on one side. Networked events cross the wire.

```ts
// client
fx.events.add('someLocalEvent', handler);      // same-side (on)
fx.events.addNet('fromServer', handler);        // from server (onNet)
fx.events.call('someLocalEvent', ...args);      // emit locally
fx.events.callRemote('toServer', ...args);      // client -> server (emitNet)

// server
fx.events.add('someLocalEvent', handler);
fx.events.addNet('fromClient', (player, ...args) => {}); // note: player is first arg
```

On the server, `addNet` hands you a `Player` as the first argument. See "The source footgun" below for why that matters.

## Commands

```ts
// client
fx.events.addCommand('heal', (args, raw) => { /* ... */ });

// server — caller is a Player, or null for console
fx.events.addCommand('setjob', (player, args) => {
  if (!player) return; // ran from server console
  // ...
});
```

## Players

Server side, `fx.players` is a pool:

```ts
fx.players.at(source);        // Player for a specific server id
fx.players.toArray();         // Player[]
fx.players.forEach(fn);
fx.players.call('event', ...args);   // emit to all clients
fx.players.broadcast('message');     // chat to all
```

A `Player` wraps a server id and gives you the common operations:

```ts
player.name;
player.ped;                   // the ped entity handle
player.position;              // Vector3 (read)
player.getIdentifier('license:');
player.call('event', ...args);
player.outputChatBox('text');
player.drop('reason');
```

Client side, `fx.player` is the local player. It's a `LocalPlayer`, which extends `Ped`, which extends `Entity`, so it has position, health, armour and so on directly:

```ts
fx.player.position;
fx.player.health = 200;
fx.player.currentVehicle;     // Vehicle | null
fx.player.serverId;
```

## Entities

Everything physical in the game is an entity handle. The client classes mirror that with inheritance:

```
Entity            position, health, model, heading, distanceTo, delete
 ├─ Ped           armour, isInVehicle, isDead
 │   └─ LocalPlayer
 └─ Vehicle       speed, engineOn, repair
```

```ts
import { Vehicle } from '@panda0day/fivex/client';

const veh = fx.player.currentVehicle;
if (veh) {
  veh.engineOn = true;
  veh.repair();
}
```

The server has a lighter `Entity` (reads work; most writes to player peds don't — see below), and `Player` is composition rather than inheritance: a player *has* a ped, it isn't one.

## Vector3 and math

`Vector3` is a real class, not a plain `{x, y, z}`. It's structurally compatible with what natives expect, so you can pass it straight into `SetEntityCoords` and friends.

```ts
import { Vector3, clamp, lerp } from '@panda0day/fivex/shared';

const a = new Vector3(0, 0, 0);
const b = new Vector3(10, 0, 0);

a.add(b);
a.distanceTo(b);
a.normalize();
a.lerp(b, 0.5);

Vector3.from(GetEntityCoords(ped, true)); // wrap a native result
```

`shared` also has the usual helpers: `clamp`, `lerp`, `remap`, `toRadians`, `toDegrees`, `randomInt`, `randomFloat`.

## Two things this handles for you

These are the parts worth having a framework for. Both are FiveM footguns that are easy to get wrong.

### The source footgun

Inside a server networked event, FiveM exposes the calling player as a global `source` that's only valid synchronously — the first `await` invalidates it, and you silently get the wrong player. `addNet` captures it immediately and passes you a `Player`, so you never touch the global and never race it:

```ts
fx.events.addNet('buyItem', async (player, itemId) => {
  // player is already resolved and safe to use after awaits
  await db.charge(player.getIdentifier('license:'), itemId);
  player.outputChatBox('Purchased.');
});
```

### Server writes to a player go through the client

Under OneSync the owning client is authoritative over its own ped. A server-side `SetEntityHealth` on a player gets reverted on the next sync tick, so it looks like it works and then snaps back. Setting health, armour or position on a `Player` therefore routes an internal event to that client, which applies the change locally where it actually sticks:

```ts
player.setHealth(200);        // not player.health = 200
player.setPosition(coords);
```

The framework registers the client-side handlers for these automatically, so you only call the server method. Reads (`player.health`, `player.position`) are direct because reading the synced value server-side is fine.

Note that this is inherent to the game's trust model: the client can ignore or fake anything you tell it to set on itself. Keep anything security-sensitive (money, permissions) in server state, never in ped state.

## Setting up a consumer project

A resource that uses the framework needs a bundler step. Minimum setup:

`package.json`

```json
{
  "scripts": { "build": "node build.js" },
  "devDependencies": {
    "@citizenfx/client": "latest",
    "@citizenfx/server": "latest",
    "@panda0day/fivex": "latest",
    "esbuild": "^0.20.0",
    "typescript": "^5.4.0"
  }
}
```

`tsconfig.json` — use `moduleResolution: "bundler"` (or `node16`) or TypeScript won't read the package's subpath exports and the `/client` and `/server` types won't resolve:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`build.js`

```js
const esbuild = require('esbuild');

const base = { bundle: true, platform: 'node', target: 'node16', format: 'cjs' };

Promise.all([
  esbuild.build({ ...base, entryPoints: ['src/client/index.ts'], outfile: 'dist/client.js' }),
  esbuild.build({ ...base, entryPoints: ['src/server/index.ts'], outfile: 'dist/server.js' }),
]).then(() => console.log('built'));
```

`fxmanifest.lua`

```lua
fx_version 'cerulean'
game 'gta5'

client_script 'dist/client.js'
server_script 'dist/server.js'
```

Then `npm run build`, drop the resource in your server, and `ensure` it.

## Working on the framework itself

The framework builds with `tsc` (not esbuild) because it needs to emit `.d.ts` files for consumers:

```bash
npm run build     # tsc -p tsconfig.client.json && tsc -p tsconfig.server.json
```

Client and server compile against separate tsconfigs so each side only sees its own natives. `shared` is included in both.

For live development against a real resource, use `npm link`:

```bash
# in the framework
npm link
# in your resource project
npm link @panda0day/fivex
```

Run `tsc -w` on the framework and your resource re-bundles against the changes.

## Notes

- `instanceof` doesn't work across resources. Each resource bundles its own copy of the framework, so an `Entity` from one resource isn't `instanceof` the `Entity` in another. This never matters inside a single resource; just don't rely on it across resource boundaries.
- Entity wrappers aren't cached. `fx.player.currentVehicle` returns a fresh object each call, so `===` won't hold for "the same" vehicle. Add a pool keyed by handle if you need identity.