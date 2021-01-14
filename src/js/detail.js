const id = window.sessionStorage.getItem('goods_id');
getImg()
async function getImg() {
    const res = await $.get('./server/goodsInfo.php', { id }, null, 'json')
        // console.log(res);
        // console.log(res.info.goods_big_logo);
    $(".show img").attr("src", res.info.goods_big_logo);
    $('.enlarge').css("background-image", `url(${res.info.goods_big_logo})`);


}

function Enlarge(select) {
    // 范围元素
    this.ele = document.querySelector(select)
    this.show = this.ele.querySelector('.show')
    this.mask = this.ele.querySelector('.mask')
    this.enlarge = this.ele.querySelector('.enlarge')
    this.showWidth = this.show.clientWidth
    this.showHeight = this.show.clientHeight
    this.bgWidth = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
    this.bgHeight = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
        // enlarge 盒子的宽度
    this.enlargeWidth = parseInt(window.getComputedStyle(this.enlarge).width)
        // enlarge 盒子的高度
    this.enlargeHeight = parseInt(window.getComputedStyle(this.enlarge).height)

    this.init()
}

Enlarge.prototype.init = function() {
    this.setScale()
    this.setMove()
}


Enlarge.prototype.overOut = function() {
    // 移入事件
    this.show.addEventListener('mouseover', () => {
            this.mask.style.display = 'block'
            this.enlarge.style.display = 'block'
        })
        // 移出事件
    this.show.addEventListener('mouseout', () => {
        this.mask.style.display = 'none'
        this.enlarge.style.display = 'none'
    })
}


Enlarge.prototype.setScale = function() {
    // 1. 计算 mask 盒子的尺寸
    this.maskWidth = this.showWidth * this.enlargeWidth / this.bgWidth
    this.maskHeight = this.showHeight * this.enlargeHeight / this.bgHeight

    // 2. 给 mask 盒子赋值
    this.mask.style.width = this.maskWidth + 'px'
    this.mask.style.height = this.maskHeight + 'px'
}


Enlarge.prototype.setMove = function() {
    // 1. 给 this.show 绑定事件
    this.show.addEventListener('mousemove', e => {
        // 处理事件对象兼容
        e = e || window.event

        // 2. 获取坐标了
        let moveX = e.offsetX - this.maskWidth / 2
        let moveY = e.offsetY - this.maskHeight / 2

        // 3. 边界值判断
        if (moveX <= 0) moveX = 0
        if (moveY <= 0) moveY = 0
        if (moveX >= this.showWidth - this.maskWidth) moveX = this.showWidth - this.maskWidth
        if (moveY >= this.showHeight - this.maskHeight) moveY = this.showHeight - this.maskHeight

        // 4. 赋值
        this.mask.style.left = moveX + 'px'
        this.mask.style.top = moveY + 'px'

        // 5. 计算背景图移动距离
        const bgX = moveX * this.enlargeWidth / this.maskWidth
        const bgY = moveY * this.enlargeHeight / this.maskHeight

        // 给 enlarge 盒子的 backgroundPosition 进行赋值
        this.enlarge.style.backgroundPosition = `-${ bgX }px -${ bgY }px`
    })
}