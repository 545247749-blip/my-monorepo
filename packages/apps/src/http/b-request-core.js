const coreMap = new Map()

// 本模块大部分功能都需要使用到Requestor
let req

/**
 * @param { Promise } requestor --请求数据
 * */
export const inject = (requestor) => {
  req = requestor
  console.log(requestor, 'requestor')
}

export const useRequestor = () => {
  return req
}

// 创建一个可以重试的请求
export const createRetryRequestor = (maxCount = 5) => {
  const req = useRequestor()
  // 进一步配置req
  return req
}

// 创建一个并发的请求
export const createParalleRequrstor = (maxCount = 4) => {
  const req = useRequestor()
  // 进一步配置req
  req.on('beforeRequest', async (config) => {
    console.log(config, 'configconfig')
    let key = options.key(config) // 获取缓存键
    const haskey = await store.has(key) // 是否存在缓存
    if (haskey && options.isValid(key, config)) { // 存在缓存并且缓存有效
      // 返回缓存结果
    }
  })
  req.on('responseBody', (config, resp) => {
    const key = options.key(config) // 获取缓存键
    store.set(key, resp.toPlain())
  })
  return req
}

// 创建一个缓存的请求
export const createCacheRequestor = (cacheOptions) => {
  const options = normalizeOptions(cacheOptions) // 参数归一化
  let store = useCacheStore(options.persist) // 使用缓存仓库
  const req = useRequestor()
  // 进一步配置req
  return req
}

/*
const req2 = createCacheRequestor({
  key: (config) => {
    return config.pathname
  },
  persist: true, // 是否开启永久缓存
  duration: 3000, // 失效时间
  isValid: (key, config) => { // 自定义缓存是否有效，比duration优先级高
  // key 缓存是否有效，请求配置
  //

  },
})
*/

// 把请求体，路径存在一个位置，看是否已经有过请求
const hashRequest = () => {

}

export const createIdempotentRequestor = (genkey) => {
  return createCacheRequestor({
    key: (config) => genkey ? genkey(config) : hashRequest(config),
    persist: false,
  })
}
