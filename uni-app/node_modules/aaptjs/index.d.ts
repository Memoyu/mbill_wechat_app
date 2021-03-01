// Type definitions for aaptjs 1.3.0


declare module "aaptjs" {
    export function add(apkfilePath: string, files: string|string[], callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function crunch(resource: string|string[], outputFolder: string, callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function dump(what: string, apkfilePath: string, callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function list(apkfilePath: string, callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function packageCmd(command: string, callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function remove(apkfilePath: string, files: string|string[], callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function singleCrunch(inputFile: string, outputfile: string, callback?: (err: Error|null, data: string) => void): Promise<string>;

    export function version(callback?: (err: Error|null, data: string) => void): Promise<string>;
}
