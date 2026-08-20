/// <reference types="@citizenfx/client" />

export class CommandManager {
    add(
        name: string,
        handler: (args: string[], raw: string) => void,
        restricted = false,
    ): void {
        RegisterCommand(name, (_s: number, args: string[], raw: string) => {
            handler(args, raw);
        }, restricted);
    }
}