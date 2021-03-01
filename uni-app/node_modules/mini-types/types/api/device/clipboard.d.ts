/**
 * @file 剪贴板
 */
declare namespace my {
  interface IClipboardOptions {
    /**
     * 调用成功的回调函数
     */
    success?(res: { text: string }): void;

    /**
     * 调用失败的回调函数
     */
    fail?(): void;

    /**
     * 调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?(res: { text: string }): void;
  }

  interface ISetClipboardOptions {
    /**
     * 剪贴板内容
     */
    text: string;
    /**
     * 调用失败的回调函数
     */
    fail?(): void;

    /**
     * 调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?(res: { success: boolean }): void;
    /**
     * 调用成功的回调函数
     */
    success?: (res: { success: boolean }) => void;
  }

  /**
   * 获取剪贴板数据。
   */
  function getClipboard(options: IClipboardOptions): void;

  /**
   * 设置剪贴板数据。
   */
  function setClipboard(options: ISetClipboardOptions): void;
}
