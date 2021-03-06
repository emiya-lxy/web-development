import { AbortControllerEx } from './AbortControllerEx';
/**
 * 延迟函数，使用 Promise 实现
 *
 * @param delayTimeInMs - 延迟时间，单位：毫秒
 * @param abortController - 取消延迟的控制器，取消后立即将 promise 设置为 fulfilled 状态
 */
export declare function delay(delayTimeInMs: number, abortController?: AbortControllerEx): Promise<void>;
