import {Notify} from "quasar";

export async function InvokeProxy(channel: string, ...args: any[]) {
    console.log("InvokeProxy", channel, args)
    let fuc!: Function;
    try {
        // @ts-ignore
        fuc = channel.split('.').reduce((obj, keyPart) => obj && obj[keyPart], window)
    } catch (e) {
        return Notify.create({message: `${channel}未定义`, color: 'negative', position: "top-right"})
    }
    try {
        return await fuc(...args);
    } catch (e) {
        // @ts-ignore
        Notify.create({message: e.message || "发生错误", color: 'negative', position: "top-right"})
        throw e;
    }

}
