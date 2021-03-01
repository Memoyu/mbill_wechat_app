/**
 * @file 下拉刷新
 */
declare namespace my {
  interface IStartPullDownRefreshOptions {
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }
  interface IStopPullDownRefreshOptions {
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }
  /**
   * 停止当前页面的下拉刷新。
   */
  function stopPullDownRefresh(options?: IStartPullDownRefreshOptions): void;

  /**
   * 开始下拉刷新。代码执行后触发下拉刷新动画，效果与用户手动下拉刷新保持一致。
   */
  function startPullDownRefresh(options?: IStopPullDownRefreshOptions): void;
}
