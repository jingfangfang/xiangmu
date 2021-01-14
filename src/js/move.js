function move(ele, target, fn) {
  // ele 要运动的元素
  // target 运动的目标位置, 是一个对象数据类型
  // fn 运动结束的回调函数

  // 1. 准备一个计数器, 用来记录开启了多少个定时器
  let count = 0

  // 2. 循环遍历 target 去开启定时器
  for (let key in target) {
    // 3. 判断传递的内容有没有 opacity 属性
    if (target[key] === 'opacity') target[key] *= 100

    count++

    const timer = setInterval(() => {
      // 拿到当前值
      let current
      if (key === 'opacity') {
        current = window.getComputedStyle(ele)[key] * 100
      } else {
        current = parseInt(window.getComputedStyle(ele)[key])
      }

      // 计算本次运动的距离
      let distance = (target[key] - current) / 10
      distance = distance > 0 ? Math.ceil(distance) : Math.floor(distance)

      // 判断是否到位
      if (current === target[key]) {
        clearInterval(timer)
        count--
        if (count === 0) fn()
      } else {
        if (key === 'opacity') {
          ele.style[key] = (current + distance) / 100
        } else {
          ele.style[key] = current + distance + 'px'
        }
      }

    }, 20)
  }


}
