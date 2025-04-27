import {ipcRenderer} from "electron";

export async function InvokeHelper(channel: string, args: any[]) {
    return await ipcRenderer.invoke(channel, ...args)
}