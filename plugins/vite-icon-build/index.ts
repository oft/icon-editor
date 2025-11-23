// vite-plugin-watch-dir-command.ts
import type { Logger, Plugin } from 'vite'
import chokidar from 'chokidar'
import type { FSWatcher } from 'chokidar'
import { exec, execSync } from 'child_process'
import { resolve } from 'path'

const environment = 'watch-dir-command'
const logOpt = {
    timestamp: true,
    environment: environment
}

/**
 * 插件配置项
 */
export interface WatchDirOptions {
    /** 要监听的文件/文件夹（支持绝对路径、相对路径、glob 模式） */
    watch: string | string[]
    /** 延迟执行时间（ms，避免频繁触发），默认 300ms */
    delay?: number
    /** 是否异步执行命令（默认 false，同步执行） */
    async?: boolean
    /** 忽略的文件/文件夹（glob 模式） */
    ignore?: string | RegExp | (string | RegExp)[]
    /** 是否静默模式（不打印日志），默认 false */
    silent?: boolean
    /** 触发变化后执行的命令（支持多个） */
    command?: string | string[]
    /** 触发变化后执行的命令（支持多个） */
    callback?: (dir?:string)=>PromiseLike<void> | ((dir?:string)=>PromiseLike<void> )[]
}

/**
 * Vite 插件：监听指定目录，触发自定义命令
 */
export default function watchDirCommand(
    options: WatchDirOptions
): Plugin {
    // 处理默认配置
    const config:WatchDirOptions = {
        delay: 300,
        async: false,
        ignore: [],
        silent: false,
        ...options,
    }

    // 标准化配置（数组化）
    const watchPaths = Array.isArray(config.watch) ? config.watch : [config.watch]

    // 解析为绝对路径
    const resolveWatchPaths = watchPaths.map((path) =>
        resolve(process.cwd(), path)
    )

    let watcher: FSWatcher | null = null
    let logger: Logger | null = null // 存储 Vite 日志实例

    return {
        name: 'vite-plugin-watch-dir-command', // 插件名称（Vite 识别用）

        configResolved(ctx) {
            logger = ctx.logger // 拿到 Vite 内置日志工具
        },

        /**
         * 开发服务器启动时初始化监听
         */
        configureServer() {
            if (config.silent) return

            const commands = Array.isArray(config.command) ? config.command : []

            resolveWatchPaths.forEach(item=>{
                logger!.info(`开始监听目录： ${item}`, logOpt)
            })
            commands.forEach(item=>{
                logger!.info(`触发后执行命令： ${item}`, logOpt)
            })

            // 初始化监听器
            watcher = chokidar.watch(resolveWatchPaths, {
                ignored: config.ignore,
                persistent: true,
                ignoreInitial: true, // 忽略初始扫描触发
                ignorePermissionErrors: true,
            })

            // 监听所有变化事件（add/change/unlink/addDir/unlinkDir）
            watcher.on('all', (event, filePath) => {
                if (!config.silent) {
                    logger!.info(
                        `检测到变化：${event} -> ${filePath}`
                    ,logOpt)
                }

                // 延迟执行命令（避免频繁触发）
                setTimeout(() => {
                    if(config.command?.length){
                        executeCommands(commands,config, logger!)
                    }
                    if(config.callback){
                        if(Array.isArray(config.callback)){
                            config.callback.forEach(cb=>cb(filePath))
                        } else {
                            config.callback(filePath);
                        }
                    }
                    

                }, config.delay)
            })

            // 监听错误
            watcher.on('error', (error: any) => {
                logger!.info('监听错误：', error.message)
            })
        },

        /**
         * 服务器关闭时停止监听
         */
        closeBundle() {
            if (watcher) {
                watcher.close()

                if (!config.silent) {
                    logger!.info('停止监听',logOpt)
                }
            }
        },
    }
}

/**
 * 执行命令（支持同步/异步）
 */
function executeCommands(
    commands: string[],
    config: Pick<WatchDirOptions, 'async' | 'silent'>,
    logger:Logger
) {
    commands.forEach((cmd) => {
        if (!config.silent) {
            (`执行命令：${cmd}`)
        }

        try {
            if (config.async) {
                // 异步执行（不阻塞 Vite 服务）
                exec(cmd, (error, stdout, stderr) => {
                    if (stdout && !config.silent) logger.info(`[输出] ${stdout}`,logOpt)
                    if (stderr && !config.silent) logger.error(`[错误输出] ${stderr}`,logOpt)
                    if (error) logger.error(`[命令执行失败] ${error.message}`,logOpt)
                })
            } else {
                // 同步执行（确保命令完成后再继续）
                const output = execSync(cmd, { encoding: 'utf-8' })
                if (output && !config.silent) logger.info(`[输出] ${output}`,logOpt)
            }
        } catch (error: any) {
            logger.error(`命令执行失败：${error.message}`,logOpt)
        }
    })
}