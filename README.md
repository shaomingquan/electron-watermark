### 快手视频打码

主要feature：

- 打码：从上到下打6行“禁止搬运”，不支持自定义
- 可批量

可做的todo：

- 自定义打码选项

### 一点技巧

- 使用`koa-compose`和`koa-router`管理ipc，参考文件：
    - src/main/routes/index.ts
    - src/main/main.ts
    - 详见：[使用koa管理类server调用](https://github.com/shaomingquan/articles/blob/master/src/%E4%BD%BF%E7%94%A8koa%E7%AE%A1%E7%90%86%E7%B1%BBserver%E8%B0%83%E7%94%A8.md)