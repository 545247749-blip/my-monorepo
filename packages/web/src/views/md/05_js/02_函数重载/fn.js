export const fn = function () {
  const fnMap = new Map()
  function overload (...args) {
    const key = args.map(it => typeof it).join(',')
    const fn = fnMap.get(key)
    if (!fn) {
      throw new TypeError('没有找到对应的实现')
    }
    return fn.apply(this, args)
  }
  overload.addImpl = function (...args) {
    const fn = args.pop()
    if (typeof fn !== 'function') {
      throw new TypeError('最后一个不是函数')
    }
    console.log(args, 'args')
    const key = args.join(',')
    fnMap.set(key, fn)
  }
  return overload
}


let fnMy = fn()
fnMy.addImpl('number', (val) => {
  console.log(val)
})

fnMy.addImpl('string', (val) => {
  console.log(val)
})


// 调用
fnMy(333)
