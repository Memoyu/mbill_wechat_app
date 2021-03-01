/// <reference path="./ui/index.d.ts" />
/// <reference path="./open/index.d.ts" />
/// <reference path="./media/index.d.ts" />
/// <reference path="./cache.d.ts" />
/// <reference path="./file.d.ts" />
/// <reference path="./location.d.ts" />
/// <reference path="./network.d.ts" />
/// <reference path="./device/index.d.ts" />
/// <reference path="./bluetooth.d.ts" />
/// <reference path="./ibeacon.d.ts" />
/// <reference path="./data.d.ts" />
/// <reference path="./share.d.ts" />
/// <reference path="./menu.d.ts" />
/// <reference path="./scene.d.ts" />
/// <reference path="./analytics.d.ts" />

declare namespace my {
  /**
   * 节点查询 https://docs.alipay.com/mini/api/selector-query
   */
  interface IBoundingClientRect {
    width: number;
    height: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  type ScrollOffset = Record<"scrollTop" | "scrollLeft", number>;

  type SelectorResult = ReadonlyArray<
    null
    | Readonly<IBoundingClientRect>
    | Readonly<ScrollOffset>
  >;

  type ISelectorExecCallback = (ret: SelectorResult) => void;

  interface ISelectorQuery {
    select(selector: string): ISelectorQuery;
    selectAll(selector: string): ISelectorQuery;
    selectViewport(): ISelectorQuery;
    boundingClientRect(): ISelectorQuery;
    scrollOffset(): ISelectorQuery;
    exec(ret: ISelectorExecCallback): void;
  }

  function createSelectorQuery(params?: Record<string, any>): ISelectorQuery;

  function canIUse(query: string): boolean;

  function reportCustomError(error: Error): void;

  function reportBizReady(): void;

  function call(apiName: string, params?: Record<string, any> | ((...args: any[]) => void)): void;
  function call(apiName: string, params?: Record<string, any>, callback?: (...args: any[]) => void): void;

  /**
   * 获取自定义配置数据：https://opendocs.alipay.com/mini/isv/creatminiapp
   */
  function getExtConfigSync(): Record<string, any>;

  /**
   * 同步获取小程序 APPID。
   */
  function getAppIdSync(): string;

  interface IUpdateManager {
    /**
     * 当小程序新版本下载完成后（即收到 onUpdateReady 回调），强制小程序重启并使用新版本。
     */
    applyUpdate(): void;

    /**
     * 监听向支付宝后台请求检查更新结果事件。
     */
    onCheckForUpdate(cb: (res: { hasUpdate: boolean }) => void): void;

    /**
     * 监听小程序有版本更新事件。
     */
    onUpdateReady(cb: () => void): void;

    /**
     * 监听小程序更新失败事件。
     */
    onUpdateFailed(cb: () => void): void;
  }

  /**
   * 创建一个 UpdateManager 对象，获取全局唯一的版本更新管理器，用于管理小程序更新。
   */
  function getUpdateManager(): IUpdateManager;

  /**
   * 唤起分享面板。当通过 my.showSharePanel 唤起分享功能时，page.onShareAppMessage 入参中 from 的值为 code。
   */
  function showSharePanel(): void;
}
