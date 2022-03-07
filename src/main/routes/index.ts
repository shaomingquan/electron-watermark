import { clipboard, IpcMainInvokeEvent, dialog } from 'electron'
import compose from 'koa-compose'
import Router from 'koa-router'

export interface ICtx {
    event: IpcMainInvokeEvent;
    args: any;
}

const withSuccess = (data: any) => {
    return {
        code: 0,
        msg: 'ok',
        data,
    }
}

const router = new Router<any, ICtx>()

router.all('/clipboard/get', async (ctx) => {
    const clipboardStr = clipboard.readText();
    ctx.body = clipboardStr
});

router.all('/select-and-get-files', async (ctx) => {
    const ret = await dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    })
    if (ret.canceled) {
        ctx.body = {
            code: 99,
            msg: '',
        }
    }
    // TODO: find all mp4
    const data = ret.filePaths
    ctx.body = withSuccess(data)
})

export const ipcHandler = compose(
    [
        router.routes()
    ]
)