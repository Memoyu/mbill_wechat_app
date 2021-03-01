/**
 * @file 滚动
 */
declare namespace my {
  interface IPageScrollToOptions {
    /**
     * 滚动到页面的目标位置，单位 px。使用 my.pageScrollTo 跳转小程序顶部时，必须将 scrollTop 值设为大于 0，方可实现跳转
     */
    scrollTop?: number;
    /**
     * 滚动动画的时长，单位ms
     */
    duration?: number;
    /**
     * 选择器
     */
    selector?: string;
    /**
     * 接口调用成功的回调函数
     */
    success?: () => void;
    /**
     * 接口调用失败的回调函数
     */
    fail?: () => void;
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?: () => void;
  }

  /**
   * 滚动到页面的目标位置。
   */
  function pageScrollTo(options: IPageScrollToOptions): void;
}
