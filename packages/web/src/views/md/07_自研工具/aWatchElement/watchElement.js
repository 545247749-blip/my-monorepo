/**
 * 元素位置和尺寸变化监听器
 * 监听指定DOM元素的视口位置、尺寸变化，包括滚动、窗口调整、样式变化等
 * @example
 * const watcher = new WatchElement(targetElement, (currentRect, previousRect) => {
 *   console.log('位置变化:', currentRect);
 * });
 *
 * // 销毁监听
 * watcher.destroy();
 */

export class WatchElement {
  /**
   * 创建元素位置监听器
   * @param {Element} targetElement - 要监听的DOM元素
   * @param {function(DOMRect, DOMRect|null): void} callback - 位置变化时的回调函数
   * @throws {Error} 当targetElement不是有效的DOM元素或callback不是函数时抛出错误
   */
  constructor (targetElement, callback) {
    if (!targetElement || !(targetElement instanceof Element)) {
      throw new Error('WatchElement: targetElement 必须是有效的DOM元素')
    }

    if (typeof callback !== 'function') {
      throw new Error('WatchElement: callback 必须是函数')
    }

    /** @type {Element} 被监听的目标元素 */
    this.target = targetElement

    /** @type {function(DOMRect|Object, DOMRect|null|Object): void} callback - 位置变化时的回调函数 */
    this.callback = callback

    /** @type {Set<Element>} 可滚动的祖先元素集合 */
    this.ancestors = new Set()

    /** @type {ResizeObserver|null} 尺寸变化观察器 */
    this.resizeObserver = null

    /** @type {MutationObserver|null} 属性变化观察器 */
    this.mutationObserver = null

    /** @type {DOMRect|null|Object} 上一次的位置信息 */
    this.lastRect = null

    /** @type {boolean} 是否正在等待RAF执行 */
    this.rafPending = false

    // 绑定方法上下文
    this.updatePosition = this.updatePosition.bind(this)
    this.init()
  }

  /**
   * 初始化监听器
   * @private
   */
  init () {
    this.setupObservers()
    this.setupScrolls()
  }

  /**
   * 设置观察器（ResizeObserver, MutationObserver）
   * @private
   */
  setupObservers () {
    this.resizeObserver = new ResizeObserver(this.updatePosition)
    this.resizeObserver.observe(this.target)
    this.mutationObserver = new MutationObserver(this.updatePosition)
    this.mutationObserver.observe(this.target, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    window.addEventListener('resize', this.updatePosition)
  }

  /**
   * 设置滚动监听
   * @private
   */
  setupScrolls () {
    this.getScrollableAncestors()
    this.ancestors.forEach(ancestor => {
      ancestor.addEventListener('scroll', this.updatePosition, { passive: true })
    })
    window.addEventListener('scroll', this.updatePosition, { passive: true })
  }

  /**
   * 获取所有可能影响目标元素位置的可滚动祖先元素
   * @returns {Set<Element>} 可滚动的祖先元素集合
   * @private
   */
  getScrollableAncestors () {
    let parent = this.target.parentElement
    while (parent && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent)
      const isScrollable = (/(auto|scroll|overlay)/).test(
        style.overflow + style.overflowX + style.overflowY,
      )
      if (isScrollable) { // && (parent.scrollHeight > parent.clientHeight)
        this.ancestors.add(parent)
      }
      parent = parent.parentElement
    }
    return this.ancestors
  }

  /**
   * 更新位置信息，使用requestAnimationFrame进行节流
   * @private
   */
  updatePosition () {
    if (this.rafPending) return
    this.rafPending = true
    requestAnimationFrame(() => {
      this.rafPending = false
      try {
        if (!this.target || !document.contains(this.target)) {
          console.warn('WatchElement: document中不存在目标DOM')
          this.destroy()
          return
        }
        let currentRect = this.target.getBoundingClientRect()
        currentRect = this.domRectToObject(currentRect)
        if (!this.lastRect || this.hasPositionChanged(this.lastRect, currentRect)) {
          this.callback(currentRect, this.lastRect)
          this.lastRect = currentRect
        }
      }
      catch (error) {
        console.warn('WatchElement error:', error)
      }
    })
  }

  /**
   * 检查位置或尺寸是否发生变化
   * @param {DOMRect|Object} prev - 前一次的位置信息
   * @param {DOMRect|Object} current - 当前的位置信息
   * @returns {boolean} 如果位置或尺寸发生变化返回true，否则返回false
   * @private
   */
  hasPositionChanged (prev, current) {
    return prev.top !== current.top ||
      prev.left !== current.left ||
      prev.width !== current.width ||
      prev.height !== current.height
  }

  /**
   * 格式转换
   * @param {DOMRect} domRect
   * @returns {Object}
   * */
  domRectToObject (domRect) {
    if (!domRect) return {}
    return {
      x: domRect.x,
      y: domRect.y,
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      right: domRect.right,
      bottom: domRect.bottom,
      left: domRect.left,
    }
  }

  /**
   * 销毁监听器，清理所有事件监听和观察器
   * @public
   */
  destroy () {
    this.resizeObserver && this.resizeObserver.disconnect()
    this.mutationObserver && this.mutationObserver.disconnect()
    window.removeEventListener('resize', this.updatePosition)
    window.removeEventListener('scroll', this.updatePosition)
    this.ancestors.forEach((ancestor) => {
      ancestor.removeEventListener('scroll', this.updatePosition)
    })
    this.ancestors.clear()
  }
}
