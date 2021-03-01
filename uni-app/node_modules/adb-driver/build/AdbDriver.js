"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const child_process_1 = require("child_process");
const which = require("which");
const base = path.resolve(__dirname, '..', 'bin');
exports.ADB_BINARY_FILE = {
    win32: path.resolve(base, 'window/adb.exe'),
    darwin: path.resolve(base, 'mac/adb'),
    linux: path.resolve(base, 'linux/adb'),
};
function isSystemAdbAvailable() {
    return !!which.sync('adb', { nothrow: true });
}
exports.isSystemAdbAvailable = isSystemAdbAvailable;
let systemAdbExist = isSystemAdbAvailable();
function execADBCommand(command, option) {
    let execCmd = command;
    if (!systemAdbExist) {
        let cmd = command.split(' ');
        const binFile = exports.ADB_BINARY_FILE[process.platform];
        cmd[0] = `"${binFile}"`;
        execCmd = cmd.join(' ');
    }
    return new Promise((resolve, reject) => {
        child_process_1.exec(execCmd, option || { stdio: 'inherit' }, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        });
    }).catch(err => {
        return err;
    });
}
exports.execADBCommand = execADBCommand;
