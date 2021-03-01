export declare const ADB_BINARY_FILE: {
    [key: string]: string;
};
export declare function isSystemAdbAvailable(): boolean;
export declare function execADBCommand(command: string, option?: object): Promise<any>;
