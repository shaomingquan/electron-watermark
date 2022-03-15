import { genTask } from "./simple-ffmpeg-task.js";

export const SingeTaskScheduler = {
    tasks: [],
    getTask () {
        return this.tasks[0]
    },
    releaseTask () {
        const ret = this.tasks[0]
        this.tasks.pop()
        return ret
    },
    newTask (task) {
        if (this.tasks.length > 0) {
            throw new Error('只能有一个task')
        }
        const nextTask = genTask(task)
        this.tasks.push(nextTask)
        return nextTask
    }
}