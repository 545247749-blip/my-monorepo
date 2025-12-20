// 共享类型定义（在JS中可以用JSDoc注释）

export * from './index2.js'

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
export const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}
 
/**
 * API基础URL
 */
export const API_BASE_URL = '/api/v1'

/**
 * 生成随机ID
 * @returns {string}
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
