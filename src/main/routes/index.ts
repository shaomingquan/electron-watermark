import { clipboard, IpcMainInvokeEvent, dialog, shell } from 'electron'
import compose from 'koa-compose'
import Router from 'koa-router'
import { SingeTaskScheduler } from '../utils/single-task-scheduler.js';
import { getTaskDir } from '../utils/simple-ffmpeg-task.js';

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
        properties: ['openFile', 'openDirectory', 'multiSelections']
    })
    if (ret.canceled) {
        ctx.body = withSuccess({cancel: true})
    }
    // TODO: find all mp4
    const data = ret.filePaths
    ctx.body = withSuccess(data)
})

router.all('/task/opendir', async (ctx) => {
    const task = ctx.args
    const dir = getTaskDir(task)
    shell.showItemInFolder(dir)
    ctx.body = withSuccess(true)
})

router.all('/task/start', async (ctx) => {
    const task = ctx.args
    const nextTask = SingeTaskScheduler.newTask(task)
    ctx.body = withSuccess(nextTask)
})

router.all('/task/refresh', async (ctx) => {
    const task = SingeTaskScheduler.getTask()
    ctx.body = withSuccess(task)
})

router.all('/task/release', async (ctx) => {
    SingeTaskScheduler.releaseTask()
    ctx.body = withSuccess(SingeTaskScheduler.getTask() === undefined)
})

export const ipcHandler = compose(
    [
        router.routes()
    ]
)