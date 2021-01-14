// 1. 封装设置 cookie
function setCookie(key, value, expires) {
  // 判断是否有 expires
  if (!expires) {
    // 表示没有, 按照会话级别设置
    document.cookie = key + '=' + value
    return
  }

  // 说明有 expires
  const time = new Date()
  time.setTime(time.getTime() - 1000 * 60 * 60 * 8 + 1000 * expires)
  document.cookie = `${ key }=${ value };expires=${ time }`
}

// 2. 封装获取 cookie
function getCookie(key) {
  const obj = {}
  // 拿到 cookie 按照 (; ) 来切割开
  const tmp = document.cookie.split('; ')

  // 循环遍历 tmp
  tmp.forEach(item => {
    // 继续切割 item 用 = 切割
    const t = item.split('=')
    obj[t[0]] = t[1]
  })

  // 准备返回值
  return key ? obj[key] : obj
}

// 3. 封装解析 查询字符串
// 查询字符串 - 一个固定格式的字符串
// key=value&key2=value2&key3=value3
function parseQueryString(str) {
  const obj = {}
  const tmp = str.split('&')

  // 循环遍历 tmp
  tmp.forEach(item => {
    // 继续切割 item
    const t = item.split('=')
    obj[t[0]] = t[1]
  })

  // 直接返回对象
  return obj
}

// 4. 封装组装 查询字符串
// 把一个对象数据结构转换成 queryString 的格式
function queryStringify(obj) {
  // 准备一个空字符串
  let str = ''

  // 循环遍历 obj
  for (let key in obj) {
    str += key + '=' + obj[key] + '&'
  }

  return str.slice(0, -1)
}

// 5. ajax
function ajax(options = {}) {
  // 1. 参数验证
  // 1-1. 验证 url 必填
  if (!options.url) {
    throw new Error('url 为必填选项')
  }

  // 1-2. 验证 method
  if (!(options.method === undefined || /^(get|post)$/i.test(options.method))) {
    throw new Error('目前只接受 GET 和 POST 请求, 请期待更新 ^_^')
  }

  // 1-3. 验证 async
  if (!(options.async === undefined || typeof(options.async) === 'boolean')) {
    throw new Error('async 只能传递一个布尔值')
  }

  // 1-4. 验证 data
  if (!(options.data === undefined || Object.prototype.toString.call(options.data) === '[object Object]' || /^(.+=.+&?)*[^&]$/.test(options.data))) {
    throw new Error('data 需要传递一个查询字符串 或者 对象数据类型2')
  }

  // 1-5. 验证 success
  if (!(options.success === undefined || typeof options.success === 'function')) {
    throw new Error('success 需要传递一个 function 数据类型')
  }

  // 1-6. 验证 error
  if (!(options.error === undefined || typeof options.error === 'function')) {
    throw new Error('error 需要传递一个 function 数据类型')
  }

  // 1-7. 验证 dataType
  if (!(options.dataType === undefined || typeof(options.dataType) === 'boolean')) {
    throw new Error('dataType 只能传递一个布尔值')
  }

  // 2. 设置默认值
  const _default = {
    url: options.url,
    method: options.method || 'GET',
    async: typeof options.async === 'boolean' ? options.async : true,
    data: options.data || '',
    success: options.success || function () {},
    error: options.error || function () {},
    dataType: typeof options.dataType === 'boolean' ? options.dataType : true,
  }
  if (typeof _default.data === 'object') {
    _default.data = queryStringify(_default.data)
  }
  if (_default.method.toUpperCase() === 'GET' && _default.data) {
    _default.url += '?' + _default.data
  }

  // 3. 发送 ajax 请求
  const xhr = new XMLHttpRequest()
  xhr.open(_default.method, _default.url, _default.async)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
      _default.success(_default.dataType ? JSON.parse(xhr.responseText) : xhr.responseText)
    }
    if (xhr.readyState === 4 && xhr.status === 404) {
      _default.error(xhr.statusText)
    }
  }
  if (_default.method.toUpperCase() === 'GET') {
    xhr.send()
  } else {
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    xhr.send(_default.data)
  }
}
