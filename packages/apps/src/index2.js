// 共享类型定义（在JS中可以用JSDoc注释）

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {any} data
 * @property {string} message
 */

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate2 = (date) => {
  return date.toISOString().split('T')[0]
}
