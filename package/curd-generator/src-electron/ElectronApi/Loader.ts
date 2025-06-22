import {ipcMain} from "electron";
import {Inject} from "app/src-electron/ElectronApi/electron/Decorator";
import {ElectronException} from "app/src-electron/ElectronApi/Exception";
import {PathHandler} from "app/src-electron/handler/common/PathHandler";

ipcMain.handle("Electron:Request", async (event, {route, data}) => {
  const handler = Inject[route];
  if (!handler) return {code: 404, message: "No handler found for route: " + route, data: {route: route}}

  try {
    const reply = await handler(event, data);
    return {code: 0, data: reply}
  } catch (e) {
    if (e instanceof ElectronException) {
      return e.toClient();
    }
    return {code: 500, message: (e as Error).message, data: e, stack: (e as Error).stack}
  }
});


export const loader = [
  PathHandler,
]

