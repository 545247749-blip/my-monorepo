
/**
 * 文件下载工具类，支持多种下载方式和自动类型修正
 * 所有方法都是静态方法，无需实例化即可使用
 *
 * @class Download
 * @static
 *
 * @example
 * // 使用简称（推荐）
 * Download.link('https://example.com/file.pdf', '文档.pdf')
 * await Download.xhr({ url: '/api/export', method: 'POST' })
 * await Download.fetch({ url: '/api/file' })
 */

export class Download {
  /**
   * 通过a标签直接下载文件（适用于普通URL和Blob URL）
   * @static
   * @param {string} url - 文件URL或Blob URL
   * @param {string} [fileName] - 文件名，如未提供则从URL提取
   * @param {boolean} [isBlobUrl=false] - 是否为Blob URL（需要释放资源）
   *
   * @example
   * // 下载普通URL
   * Download.link('https://example.com/file.pdf', '文档.pdf')
   *
   * @example
   * // 下载Blob URL（会自动释放资源）
   * const blobUrl = URL.createObjectURL(blob)
   * Download.link(blobUrl, 'file.pdf', true)
   */
  static link (url, fileName, isBlobUrl = false) {
    if (!url) {
      console.error('Download URL is required')
      return
    }
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || this.extractFilenameFromUrl(url) || 'download'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (isBlobUrl) {
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url)
        }
        catch (e) {
          console.warn('Failed to revoke Object URL:', e)
        }
      }, 1000)
    }
  }

  /**
   * 使用XHR下载文件（支持GET/POST，提供进度监控）
   * @static
   * @param {Object} options - 配置参数
   * @param {string} options.url - 请求URL
   * @param {string} [options.filename] - 文件名
   * @param {'GET' | 'get' | 'post' | 'POST'} [options.method='GET'] - 请求方法
   * @param {Object} [options.data] - 请求数据（POST时使用）
   * @param {Object} [options.headers] - 请求头
   * @param {number} [options.timeout=0] - 超时时间(毫秒)
   * @param {Function} [options.onProgress] - 进度回调函数（接收对象参数）
   * @param {string} [options.forceMimeType] - 强制指定MIME类型
   * @param {number} [options.progressInterval=100] - 进度报告间隔(毫秒)
   * @param {number} [options.progressPercentInterval=5] - 进度百分比间隔(%)
   * @returns {Promise<Object>} 下载结果
   */
  static xhr (options) {
    const {
      url,
      filename,
      method = 'GET',
      data = null,
      headers = {},
      timeout = 0,
      onProgress = null,
      forceMimeType = null,
      progressInterval = 100,
      progressPercentInterval = 5,
    } = options
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('URL is required'))
        return
      }
      const xhr = new XMLHttpRequest()
      xhr.open(method.toUpperCase(), url, true)
      xhr.responseType = 'blob'
      xhr.timeout = timeout
      // 设置请求头
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })
      const contentType = headers['Content-Type'] || headers['content-type']
      const isJson = contentType === 'application/json'
      let blobUrl = null
      // 🆕 进度监控相关变量
      let startTime = Date.now()
      let lastProgressTime = startTime
      let lastProgressPercent = 0
      let lastLoaded = 0
      let totalSize = 0
      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            const originalContentType = xhr.getResponseHeader('content-type') || ''
            const blob = xhr.response
            const correctedBlob = await this.fixBlobType(
              blob,
              originalContentType,
              forceMimeType,
              url,
              filename,
            )
            blobUrl = URL.createObjectURL(correctedBlob)
            const actualFilename = filename || this.extractFilename(xhr, url, true)
            this.link(blobUrl, actualFilename, true)
            const endTime = Date.now()
            const totalTime = endTime - startTime
            const averageSpeed = totalTime > 0 ? Math.round((correctedBlob.size / totalTime) * 1000) : 0
            resolve({
              success: true,
              filename: actualFilename,
              status: xhr.status,
              size: correctedBlob.size,
              correctedType: correctedBlob.type !== originalContentType,
              downloadStats: { // 🆕 下载统计信息
                startTime: startTime,
                endTime: endTime,
                totalTime: totalTime,
                totalTimeFormatted: this.formatTime(totalTime),
                averageSpeed: averageSpeed,
                averageSpeedFormatted: this.formatSpeed(averageSpeed),
              },
            })
          }
          catch (error) {
            if (blobUrl) URL.revokeObjectURL(blobUrl)
            reject(new Error(`Download processing failed: ${error.message}`))
          }
        }
        else {
          reject(new Error(`HTTP error! status: ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error(`Network error occurred while downloading from ${url}`))
      }

      xhr.ontimeout = () => {
        reject(new Error(`Request timeout after ${timeout}ms`))
      }

      // 🆕 进度监控（使用对象参数）
      if (onProgress) {
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const currentTime = Date.now()
            const timeDiff = currentTime - lastProgressTime
            const elapsedTime = currentTime - startTime
            totalSize = event.total
            const currentLoaded = event.loaded
            const currentPercent = Math.round((currentLoaded / totalSize) * 100)
            // 🎯 节流条件：固定100ms或5%进度变化
            const shouldReport = timeDiff > progressInterval || Math.abs(currentPercent - lastProgressPercent) >= progressPercentInterval
            if (shouldReport) {
              // 计算当前速度
              const speed = timeDiff > 0 ? Math.round(((currentLoaded - lastLoaded) / timeDiff) * 1000) : 0
              const speedFormatted = this.formatSpeed(speed)
              const elapsedFormatted = this.formatTime(elapsedTime)
              // 计算剩余时间
              let remainingTime = null
              let remainingFormatted = '计算中...'
              if (speed > 0) {
                remainingTime = Math.round((totalSize - currentLoaded) / speed * 1000)
                remainingFormatted = this.formatTime(remainingTime)
              }
              // 🆕 使用对象参数回调
              onProgress({
                percent: currentPercent,
                loaded: currentLoaded,
                total: totalSize,
                speed: speed,
                speedFormatted: speedFormatted,
                elapsedTime: elapsedTime,
                elapsedFormatted: elapsedFormatted,
                remainingTime: remainingTime,
                remainingFormatted: remainingFormatted,
              })
              lastProgressTime = currentTime
              lastProgressPercent = currentPercent
              lastLoaded = currentLoaded
            }
          }
        }
        // 🆕 监听加载开始，获取总大小
        xhr.onloadstart = (event) => {
          if (event.lengthComputable) {
            totalSize = event.total
          }
        }
      }
      // 发送请求
      try {
        if (method.toUpperCase() === 'POST' && data) {
          const body = isJson ? JSON.stringify(data) : data
          xhr.send(body)
        }
        else {
          xhr.send()
        }
      }
      catch (error) {
        reject(new Error(`Request sending failed: ${error.message}`))
      }
    })
  }

  /**
   * 使用Fetch API下载文件（支持GET/POST，现代API）
   * @static
   * @param {Object} options - 配置参数
   * @param {string} options.url - 请求URL
   * @param {string} [options.filename] - 文件名
   * @param {'GET' | 'get' | 'post' | 'POST'} [options.method='GET'] - 请求方法
   * @param {Object} [options.data] - 请求数据（POST时使用）
   * @param {Object} [options.headers] - 请求头
   * @param {string} [options.forceMimeType] - 强制指定MIME类型
   * @param {Function} [options.onProgress] - 进度回调函数
   * @returns {Promise<Object>} 下载结果
   *
   * @example
   * // 基本GET下载
   * await Download.fetch({
   *   url: '/api/file.pdf'
   * })
   *
   * @example
   * // POST下载JSON数据
   * await Download.fetch({
   *   url: '/api/generate-report',
   *   method: 'POST',
   *   data: { format: 'pdf', data: {...} }
   * })
   */
  static async fetch (options) {
    const {
      url,
      filename,
      method = 'GET',
      data = null,
      headers = {},
      forceMimeType = null,
      onProgress = null,
      progressInterval = 100,
      progressPercentInterval = 5,
    } = options
    if (!url) {
      throw new Error('URL is required')
    }
    let blobUrl = null
    let startTime = Date.now()
    let endTime = null
    try {
      const config = {
        method: method.toUpperCase(),
        headers: { ...headers },
      }
      if (method.toUpperCase() === 'POST' && data) {
        if (!headers['Content-Type'] && !headers['content-type']) {
          config.headers['Content-Type'] = 'application/json'
        }
        config.body = (config.headers['Content-Type'] === 'application/json')
          ? JSON.stringify(data)
          : data
      }
      const resp = await fetch(url, config)
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`)
      }
      const originalContentType = resp.headers.get('content-type') || ''
      const contentLength = resp.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0
      let arrayBuffer
      if (onProgress && total > 0 && resp.body) {
        const reader = resp.body.getReader()
        const chunks = []
        let loaded = 0
        let lastTime = startTime
        let lastLoaded = 0
        let lastPercent = 0
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          loaded += value.length
          const currentTime = Date.now()
          const timeDiff = currentTime - lastTime
          const elapsedTime = currentTime - startTime
          const currentPercent = Math.round((loaded / total) * 100)
          // 🎯 统一的节流条件
          const shouldReport = timeDiff > progressInterval || Math.abs(currentPercent - lastPercent) >= progressPercentInterval
          if (shouldReport) {
            const speed = timeDiff > 0 ? Math.round(((loaded - lastLoaded) / timeDiff) * 1000) : 0
            const speedFormatted = this.formatSpeed(speed)
            const elapsedFormatted = this.formatTime(elapsedTime)
            let remainingTime = null
            let remainingFormatted = '计算中...'
            if (speed > 0) {
              remainingTime = Math.round((total - loaded) / speed * 1000)
              remainingFormatted = this.formatTime(remainingTime)
            }
            // 🆕 使用对象参数回调
            onProgress({
              percent: currentPercent,
              loaded: loaded,
              total: total,
              speed: speed,
              speedFormatted: speedFormatted,
              elapsedTime: elapsedTime,
              elapsedFormatted: elapsedFormatted,
              remainingTime: remainingTime,
              remainingFormatted: remainingFormatted,
            })
            lastTime = currentTime
            lastLoaded = loaded
            lastPercent = currentPercent
          }
        }
        // 最终进度报告
        endTime = Date.now()
        const totalTime = endTime - startTime
        const avgSpeed = totalTime > 0 ? Math.round((loaded / totalTime) * 1000) : 0
        const avgSpeedFormatted = this.formatSpeed(avgSpeed)
        const totalTimeFormatted = this.formatTime(totalTime)
        onProgress({
          percent: 100,
          loaded: loaded,
          total: total,
          speed: avgSpeed,
          speedFormatted: avgSpeedFormatted,
          elapsedTime: totalTime,
          elapsedFormatted: totalTimeFormatted,
          remainingTime: 0,
          remainingFormatted: '0秒',
        })
        // 合并chunks
        arrayBuffer = new Uint8Array(loaded)
        let position = 0
        for (const chunk of chunks) {
          arrayBuffer.set(chunk, position)
          position += chunk.length
        }
      }
      else {
        arrayBuffer = await resp.arrayBuffer()
        endTime = Date.now()
        const totalTime = endTime - startTime
        const totalTimeFormatted = this.formatTime(totalTime)
        if (total > 0 && onProgress) {
          onProgress({
            percent: 100,
            loaded: total,
            total: total,
            speed: 0,
            speedFormatted: '0 KB/s',
            elapsedTime: totalTime,
            elapsedFormatted: totalTimeFormatted,
            remainingTime: 0,
            remainingFormatted: '0秒',
          })
        }
      }
      const blob = await this.fixBlobType(
        arrayBuffer,
        originalContentType,
        forceMimeType,
        url,
        filename,
      )
      blobUrl = URL.createObjectURL(blob)
      const actualFilename = filename || this.extractFilename(resp, url, false)
      this.link(blobUrl, actualFilename, true)
      const finalEndTime = Date.now()
      const totalDownloadTime = finalEndTime - startTime
      return {
        success: true,
        filename: actualFilename,
        status: resp.status,
        size: blob.size,
        correctedType: blob.type !== originalContentType,
        downloadStats: {
          startTime: startTime,
          endTime: finalEndTime,
          totalTime: totalDownloadTime,
          totalTimeFormatted: this.formatTime(totalDownloadTime),
          averageSpeed: totalDownloadTime > 0 ? Math.round((blob.size / totalDownloadTime) * 1000) : 0,
          averageSpeedFormatted: this.formatSpeed(totalDownloadTime > 0 ? Math.round((blob.size / totalDownloadTime) * 1000) : 0),
        },
      }
    }
    catch (error) {
      console.error('Download failed:', error)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      throw error
    }
  }

  /**
   * 格式化时间为友好显示
   * @static
   * @param {number} milliseconds - 毫秒数
   * @returns {string} 格式化后的时间
   */
  static formatTime (milliseconds) {
    if (milliseconds === 0) return '0秒'

    const seconds = Math.floor(milliseconds / 1000)

    if (seconds < 60) {
      return `${seconds}秒`
    }
    else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`
    }
    else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      if (minutes === 0 && remainingSeconds === 0) {
        return `${hours}小时`
      }
      else if (remainingSeconds === 0) {
        return `${hours}小时${minutes}分`
      }
      else {
        return `${hours}小时${minutes}分${remainingSeconds}秒`
      }
    }
  }

  /**
   * 格式化下载速度为友好显示
   * @static
   * @param {number} speed - 速度（字节/秒）
   * @returns {string} 格式化后的速度
   */
  static formatSpeed (speed) {
    if (speed === 0) return '0 KB/s'
    if (speed < 1024) {
      return `${speed} B/s`
    }
    else if (speed < 1024 * 1024) {
      return `${(speed / 1024).toFixed(1)} KB/s`
    }
    else if (speed < 1024 * 1024 * 1024) {
      return `${(speed / 1024 / 1024).toFixed(1)} MB/s`
    }
    else {
      return `${(speed / 1024 / 1024 / 1024).toFixed(1)} GB/s`
    }
  }

  /**
   * 格式化文件大小为友好显示
   * @static
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  static formatSize (bytes) {
    if (bytes === 0) return '0 B'
    if (bytes < 1024) {
      return `${bytes} B`
    }
    else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    }
    else {
      return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
    }
  }
  
  /**
   * 判断浏览器是否支持打开
   * */
  static observeSupports = (ext) => {
    ext = ext.split('?')[0].split('.').slice(-1)[0].toLowerCase()
    const exts = ['html', 'htm', 'txt', 'css', 'js', 'json', 'xml', 'svg',
                  'jpg', 'jpeg', 'png', 'gif', 'webp',
                  'mp4', 'webm', 'mp3', 'ogg', 'wav', 'pdf', 'md']
    return exts.includes(ext)
  }

  /**
   * 修正Blob的MIME类型（统一处理XHR和Fetch）
   */
  static async fixBlobType (data, originalContentType, forceMimeType, url, filename) {
    // 1. 如果强制指定了类型，优先使用
    if (forceMimeType) {
      return this.createBlobWithType(data, forceMimeType)
    }
    // 2. 判断是否需要修正
    const shouldFix = await this.shouldFixContentType(originalContentType, data, url, filename)
    if (!shouldFix) {
      return this.createBlobWithType(data, originalContentType)
    }
    // 3. 推断正确的MIME类型
    const correctType = await this.inferCorrectMimeType(data, url, filename)
    if (correctType && correctType !== originalContentType) {
      console.warn(`Correcting MIME type from ${originalContentType} to ${correctType}`)
      return this.createBlobWithType(data, correctType)
    }
    return this.createBlobWithType(data, originalContentType)
  }

  /**
   * 创建指定类型的Blob（统一处理不同输入类型）
   */
  static createBlobWithType (data, mimeType) {
    if (data instanceof Blob) {
      return new Blob([data], { type: mimeType })
    }
    else {
      return new Blob([data], { type: mimeType })
    }
  }

  /**
   * 判断是否需要修正Content-Type
   */
  static async shouldFixContentType (originalType, data, url, filename) {
    if (!originalType) return true
    // 这些通用类型通常需要进一步推断
    const genericTypes = [
      'application/octet-stream',
      'text/plain',
      'application/download',
      'binary/octet-stream',
      'application/force-download',
    ]
    // 如果原始类型是通用类型，需要修正
    if (genericTypes.some(type => originalType.includes(type))) {
      return true
    }
    // 如果类型明显错误
    const fileExtension = this.getFileExtension(url, filename)
    const mismatches = [
      {
        wrong: 'text/html',
        patterns: [/\.(pdf|zip|exe|dmg|xlsx?|docx?|jpg|png|gif)$/i],
      },
      {
        wrong: 'application/json',
        patterns: [/\.(pdf|xlsx?|docx?|jpg|png|gif|zip)$/i],
      },
    ]
    const hasMismatch = mismatches.some(mismatch => originalType.includes(mismatch.wrong) &&
      mismatch.patterns.some(pattern => pattern.test(fileExtension)),
    )
    if (hasMismatch) {
      return true
    }
    // 进一步通过魔数验证类型是否匹配
    try {
      const detectedType = await this.detectMimeTypeByMagicNumbers(data)
      return detectedType && detectedType !== originalType
    }
    catch (e) {
      return false
    }
  }

  /**
   * 推断正确的MIME类型
   */
  static async inferCorrectMimeType (data, url, filename) {
    // 1. 从文件名/URL扩展名推断
    const extension = this.getFileExtension(url, filename)
    const typeFromExtension = this.getMimeTypeFromExtension(extension)
    if (typeFromExtension) {
      return typeFromExtension
    }
    // 2. 通过文件魔数检测
    const typeFromMagicNumbers = await this.detectMimeTypeByMagicNumbers(data)
    if (typeFromMagicNumbers) {
      return typeFromMagicNumbers
    }
    return null
  }

  /**
   * 通过文件魔数检测MIME类型
   */
  static async detectMimeTypeByMagicNumbers (data) {
    try {
      let arrayBuffer

      if (data instanceof Blob) {
        const slice = data.slice(0, 8) // 读取前8字节
        arrayBuffer = await slice.arrayBuffer()
      }
      else if (data instanceof ArrayBuffer) {
        arrayBuffer = data.slice(0, 8)
      }
      else {
        return null
      }
      const uint8Array = new Uint8Array(arrayBuffer)
      // 检测常见的文件类型魔数
      // PDF: %PDF
      if (uint8Array[0] === 0x25 && uint8Array[1] === 0x50 &&
        uint8Array[2] === 0x44 && uint8Array[3] === 0x46) {
        return 'application/pdf'
      }
      // ZIP, Office文档: PK..
      else if (uint8Array[0] === 0x50 && uint8Array[1] === 0x4B &&
        uint8Array[2] === 0x03 && uint8Array[3] === 0x04) {
        return 'application/zip'
      }
      // JPEG: FF D8 FF
      else if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
        return 'image/jpeg'
      }
      // PNG: .PNG
      else if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 &&
        uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
        return 'image/png'
      }
      // GIF: GIF8
      else if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 &&
        uint8Array[2] === 0x46 && uint8Array[3] === 0x38) {
        return 'image/gif'
      }
    }
    catch (error) {
      console.warn('Magic number detection failed:', error)
    }
    return null
  }

  /**
   * 获取文件扩展名
   */
  static getFileExtension (url, filename) {
    // 优先从filename中提取
    if (filename && filename.includes('.')) {
      return filename.split('.').pop().toLowerCase()
    }
    // 从URL中提取
    try {
      const pathname = new URL(url, window.location.origin).pathname
      const lastPart = pathname.split('/').pop()
      if (lastPart && lastPart.includes('.')) {
        return lastPart.split('.').pop().toLowerCase()
      }
    }
    catch (e) {
      // 忽略错误
    }
    return ''
  }

  /**
   * 根据扩展名获取MIME类型
   */
  static getMimeTypeFromExtension (extension) {
    const mimeMap = {
      // 文档
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // 表格
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // 图片
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      // 压缩包
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      // 文本
      'txt': 'text/plain',
      'csv': 'text/csv',
      'json': 'application/json',
    }

    return mimeMap[extension.toLowerCase()] || null
  }

  /**
   * 从响应中提取文件名（通用方法，支持Fetch和XHR）
   */
  static extractFilename (response, url, isXHR = false) {
    // 1. 从Content-Disposition头提取
    const filenameFromHeader = this.extractFilenameFromHeaders(response, isXHR)
    if (filenameFromHeader) return filenameFromHeader
    // 2. 从URL路径提取文件名
    const filenameFromUrl = this.extractFilenameFromUrl(url)
    if (filenameFromUrl) return filenameFromUrl
    // 3. 生成默认文件名
    return this.generateDefaultFilename(response, isXHR)
  }

  /**
   * 从Content-Disposition头提取文件名
   */
  static extractFilenameFromHeaders (response, isXHR) {
    let disposition = isXHR
      ? response.getResponseHeader('content-disposition')
      : response.headers.get('content-disposition')
    if (!disposition) return null
    try {
      // 处理编码
      let decodedDisposition
      try {
        decodedDisposition = decodeURIComponent(disposition)
      }
      catch (e) {
        decodedDisposition = decodeURI(disposition)
      }
      // 匹配各种文件名格式
      const patterns = [
        /filename\*=(?:utf-8|UTF-8)''([^;]+)/i,
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i,
        /attachment[^;]*filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i,
      ]
      for (const pattern of patterns) {
        const match = decodedDisposition.match(pattern)
        if (match && match[1]) {
          let filename = match[1].replace(/['"]/g, '').trim()
          if (filename) {
            // 处理URL编码
            if (filename.includes('%')) {
              try {
                filename = decodeURIComponent(filename)
              }
              catch (e) {
                // 解码失败，保持原样
              }
            }
            return filename
          }
        }
      }
    }
    catch (e) {
      console.warn('Failed to parse content-disposition:', e)
    }
    return null
  }

  /**
   * 从URL中提取文件名
   */
  static extractFilenameFromUrl (url) {
    try {
      const urlObj = new URL(url, window.location.origin)
      const pathname = urlObj.pathname
      const filename = pathname.split('/').pop()
      if (filename && filename.includes('.')) {
        return filename.split('?')[0] // 移除查询参数
      }
    }
    catch (e) {
      console.warn('Failed to parse URL for filename:', e)
    }
    return null
  }

  /**
   * 生成默认文件名
   */
  static generateDefaultFilename (response, isXHR) {
    const contentType = isXHR
      ? response.getResponseHeader('content-type')
      : response.headers.get('content-type')
    const typeMap = {
      'application/pdf': 'document.pdf',
      'application/vnd.ms-excel': 'spreadsheet.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet.xlsx',
      'application/msword': 'document.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document.docx',
      'application/zip': 'archive.zip',
      'image/jpeg': 'image.jpg',
      'image/png': 'image.png',
      'text/plain': 'text.txt',
      'text/csv': 'data.csv',
      'application/json': 'data.json',
    }
    if (contentType) {
      for (const [type, filename] of Object.entries(typeMap)) {
        if (contentType.includes(type)) {
          return filename
        }
      }
    }
    // 最终回退：基于时间戳的文件名
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
    return `download-${timestamp}`
  }


  static handleProgressLog (progress) {
    const barLength = 20
    const filledLength = Math.round(barLength * progress.percent / 100)
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)
    console.log(
      `┌ 下载进度 [${bar}] ${progress.percent}%\n` +
      `├ 已下载: ${Download.formatSize(progress.loaded)} / ${Download.formatSize(progress.total)}\n` +
      `├ 速度: ${progress.speedFormatted}\n` +
      `├ 已用时间: ${progress.elapsedTime}ms\n` +
      `├ 已用时间: ${progress.elapsedFormatted}\n` +
      `├ 剩余时间: ${progress.remainingTime}ms\n` +
      `└ 剩余时间: ${progress.remainingFormatted}`,
    )
  }

  static handleFinishLog (result) {
    console.log(`
      🎉 下载完成！
      📁 文件名: ${result.filename}
      📊 文件大小: ${Download.formatSize(result.size)}
      ⏱️ 总耗时: ${result.downloadStats.totalTime}ms
      🚀 平均速度: ${result.downloadStats.averageSpeedFormatted}
      🕐 开始时间: ${new Date(result.downloadStats.startTime).toLocaleTimeString()}
      🕐 结束时间: ${new Date(result.downloadStats.endTime).toLocaleTimeString()}
      `)
  }
}
