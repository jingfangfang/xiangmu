$(function() {
    //准备一个商品列表信息
    const list_info = {
        cat_one: 'all',
        cat_two: 'all',
        cat_three: 'all',
        sort: 'id', // id 表示 综合排序, price 表示 价格排序
        sortType: 'ASC',
        current: 1,
        pagesize: 12
    }

    // 2. 请求一级分类列表
    getCatOne()
    async function getCatOne() {
        // 2-1. 请求一级分类列表
        const { list } = await $.get('./server/catOne.php', null, null, 'json')

        // 2-2. 渲染页面
        let str = '<span class="active">全部</span>'
        list.forEach(item => {
            str += `<span>${ item.cat_one_id }</span>`
        })
        $('.cat_one .right').html(str)
    }

    // 3. 一级分类的点击事件
    $('.cat_one .right').on('click', 'span', function() {
        // 3-1. 切换类名
        $(this).addClass('active').siblings().removeClass('active')

        // 3-2. 拿到点击的这个 span 的分类内容
        const cat_one = $(this).text()

        // 3-3. 修改 list_info
        // 因为每一次的切换都要从新请求商品列表
        list_info.cat_one = cat_one
            // 任何一个的修改都应该把二级分类修改为 all
        list_info.cat_two = 'all'
            // 任何一个的修改都应该把三级分类修改为 all
        list_info.cat_three = 'all'
            // 给三级列表回归
        $('.cat_three .right').html('<span class="active">全部</span>')

        // 3-4. 要请求二级列表
        // 条件判断, 如果点击的是全部, 那么不请求二级列表
        // 只有点击的不是全部的时候, 才会请求二级列表
        if (cat_one === '全部') {
            // 点击的全部
            // 给二级列表回归
            $('.cat_two .right').html('<span class="active">全部</span>')
                // 把 list_info 里面的 cat_one 改变成 all
            list_info.cat_one = 'all'
        } else {
            // 请求二级分类列表
            getCatTwo()
        }

        // console.group('根据下列信息请求商品列表')
        // console.log(list_info)
        // console.groupEnd()

        // 每次点击一级分类都要从新执行请求总页数的方法
        getCount()
    })

    // 4. 请求二级分类列表
    async function getCatTwo() {
        // 4-1. 请求数据, 携带参数是 list_info.cat_one
        const { list } = await $.get('./server/catTwo.php', { cat_one: list_info.cat_one }, null, 'json')

        // 4-2. 渲染页面
        let str = '<span class="active">全部</span>'
        list.forEach(item => {
            str += `<span>${ item.cat_two_id }</span>`
        })
        $('.cat_two .right').html(str)
    }

    // 5. 二级分类列表的事件
    $('.cat_two .right').on('click', 'span', function() {
        // 5-1. 切换类名
        $(this).addClass('active').siblings().removeClass('active')

        // 5-2. 拿到分类内容
        const cat_two = $(this).text()

        // 5-3. 修改 list_info
        list_info.cat_two = cat_two
            // 修改 list_info 里面的 cat_three 回归
        list_info.cat_three = 'all'

        // 5-4. 条件判断请求三级分类列表
        if (cat_two === '全部') {
            // 让 list_info 里面的 cat_two === 'all'
            list_info.cat_two = 'all'
                // 让三级列表回归
            $('.cat_three .right').html('<span class="active">全部</span>')
        } else {
            // 请求三级分类列表
            getCatThree()
        }


        // console.group('根据下列信息请求商品列表')
        // console.log(list_info)
        // console.groupEnd()

        // 每次切换二级分类也要从新请求总页数
        getCount()
    })

    // 6. 请求三级分类列表
    async function getCatThree() {
        // 6-1. 发送请求
        const { list } = await $.get('./server/catThree.php', { cat_one: list_info.cat_one, cat_two: list_info.cat_two }, null, 'json')

        // 6-2. 渲染页面
        let str = '<span class="active">全部</span>'
        list.forEach(item => {
            str += `<span>${ item.cat_three_id }</span>`
        })
        $('.cat_three .right').html(str)
    }

    // 7. 三级分类列表的事件
    $('.cat_three .right').on('click', 'span', function() {
        // 7-1. 切换类名
        $(this).addClass('active').siblings().removeClass('active')

        // 7-2. 拿到点击的文本内容
        const cat_three = $(this).text()

        // 7-3. 修改 list_info 里面的 cat_three
        list_info.cat_three = cat_three

        // 7-4. 条件判断
        if (cat_three === '全部') {
            list_info.cat_three = 'all'
        }

        console.group('根据下列信息请求商品列表')
        console.log(list_info)
        console.groupEnd()

        // 每次切换三级分类也要请求总页数
        getCount()
    })

    // 8. 请求总条数
    getCount()
    async function getCount() {
        // 8-1. 发起请求
        const { count } = await $.get('./server/getCount.php', { cat_one: list_info.cat_one, cat_two: list_info.cat_two, cat_three: list_info.cat_three }, null, 'json')


        new Pagination('.pagination', {
            total: count,
            pagesize: 12,
            sizeList: [12, 16, 20, 24],

            change(current, pagesize) {
                // 先把 listInfo 里面的数据修改掉
                list_info.current = current
                list_info.pagesize = pagesize

                // 请求商品列表
                getGoodsList()
            }
        })
    }

    // 9. 请求商品列表
    async function getGoodsList() {
        // 9-1. 请求商品列表
        const { list } = await $.get('./server/goodsList.php', list_info, null, 'json')

        // 9-2. 渲染页面
        let str = ''
        list.forEach(item => {
            str += `
            <li class="thumbnail">
              <img src="${ item.goods_big_logo }" alt="">
              <div class="caption">
                <h3 data-id="${ item.goods_id }">${ item.goods_name }</h3>
                <p class="price">￥ <span class="text-danger">${ item.goods_price }</span></p>
                <p>
                  <a href="javascript:;" class="btn btn-danger" role="button">加入购物车</a>
                  <a  class="img btn btn-warning" role="button">去结算</a>
                </p>
              </div>
            </li>
          `
        })

        // 插入页面
        $('.goodsList ul').html(str);

        //点击带入图片
        // $('.img').on('click', function() {
        //     //获取商品id
        //     const id = window.sessionStorage.getItem('goods_id');
        //     console.log(id);
        // })
    }

    // 10. 排序方式的切换
    $('.sort_list .right').on('click', 'span', function() {
        // 10-3. 修改排序方式
        // 修改 list_info.sort 之前确定
        if (list_info.sort === this.dataset.sort) {
            list_info.sortType = list_info.sortType === 'ASC' ? 'DESC' : 'ASC'
        } else {
            list_info.sortType = 'ASC'
        }

        console.log('切换排序方式')
            // 10-2. 拿到你点击的这个按钮代表的排序方式
            // 设置给 listInfo 里面的 sort 属性就可以
        list_info.sort = this.dataset.sort

        // 10-4. 还原到第一页
        list_info.current = 1

        // 10-5. 切换类名
        $(this).addClass('active').siblings().removeClass('active')

        // 10-6. 请求列表数据
        getGoodsList()
    })

    // 11. 每一个商品的点击事件
    $('.goodsList ul').on('click', 'h3', function() {
        // 拿到元素身上存储的 id
        // 存储在 sessionStorage 里面的
        window.sessionStorage.setItem('goods_id', this.dataset.id)

        // 跳转页面
        window.location.href = './detail.html'
    })

})