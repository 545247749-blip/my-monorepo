import timezoneMap from './timezoneMap'

export default class TimeZoneClass {
  static data

  static getDate (timeZone, value) {
    if (!timeZone || !value) return false
    const dateArr = value.split(/(\D)/).filter(it => !isNaN(parseFloat(it)) && isFinite(it))
    if (dateArr.length < 4) return false
    const obj = timezoneMap[timeZone] || {}
    const abbrs = obj.abbr || []
    const offsets = obj.offset || []
    this.data = {
      timeZone,
      isSummer: false,
      isEmpty: false,
      isVague: false,
      abbrs,
      offsets,
      input: {
        value,
        dateArr,
      },
      output: {
        value,
        abbr: abbrs[0],
        offset: offsets[0],
        dateArr,
      },
    }
    if (abbrs.length < 2) return this.data
    const formate = this.dateTimeFormate(this.data.input.value, this.data.offsets[0])
    this.data.isSummer = this.isSummer(formate)
    this.isSummerHourStart(formate)
    this.isSummerHourEnd(formate)
    if (this.data.isEmpty) {
      console.log('不存在的时间已经纠正为正确的时间')
    }
    if (this.data.isSummer) {
      this.data.output.abbr = abbrs[1]
      this.data.output.offset = offsets[1]
    }
    return this.data
  }

  static dateTimeFormate (value, offset) {
    let date
    if (typeof value === 'number') {
      date = value
    }
    else if (typeof value === 'string') {
      date = value.split(/(\D)/).filter(it => !isNaN(parseFloat(it)) && isFinite(it))
      offset = offset.replace('GMT', '').replace(' ', '')
      date = `${date[0]}-${date[1]}-${date[2]}T${date[3] || '00'}:${date[4] || '00'}:${date[4] || '00'}${offset || ''}`
    }
    else {
      throw new Error('时间有问题')
    }
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: this.data.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long',
    })
    let time = new Date(date).getTime()
    const obj = { time }
    formatter.formatToParts(time).forEach(item => {
      obj[item.type] = item.value
    })
    return obj
  }

  static isSummer (formate) {
    const timeZoneName = formate.timeZoneName.toLowerCase() || ''
    return timeZoneName.includes('summer') || formate.timeZoneName.includes('daylight')
  }

  // 判断时间是否一致，以及是否是不存在的时间
  static isSummerHourStart (formate) {
    if (!this.data.isSummer) return
    const dateArr = this.data.input.dateArr
    const formateH = formate.hour || ''
    const type = Number(formateH) !== Number(dateArr[3])
    if (type) {
      const getTime = Date.parse(this.data.input.value + ' ' + this.data.offsets[0]) - 1000 * 3600
      const getHours = this.dateTimeFormate(getTime).hour
      const hour = ((dateArr[3] - 1) + 24) % 24
      if (Number(getHours) === hour) {
        this.data.output.dateArr = [formate.year, formate.month, formate.day, formate.hour, formate.minute || 0, formate.second || 0]
          .slice(0, this.data.input.dateArr.length)
        this.data.output.value = this.data.output.dateArr.reduce((res, item, index) => {
          if (index === 0) {
            res += item
          }
          else if ([1, 2].includes(index)) {
            res += `-${item}`
          }
          else if (index === 3) {
            res += ` ${item}`
          }
          else if ([4, 5].includes(index)) {
            res += `:${item}`
          }
          return res
        }, '')
        this.data.isEmpty = true
      }
    }
  }

  // 判断是否存在重复的时间
  static isSummerHourEnd () {
    if (this.data.isSummer) return
    let GMTs = this.data.offsets.reduce((res, item) => {
      const formate = this.dateTimeFormate(this.data.input.value, item)
      const formmateH = formate.hour || ''
      res.add(formmateH)
      return res
    }, new Set())
    if (GMTs.size < 2) {
      this.data.isVague = true
    }
  }
}
