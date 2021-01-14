// const b = new Banner('.banner')
//轮播图
new Banner('.box');

// 搜索框
const ol = document.querySelector('[name="ul"]')
const inp = document.querySelector('[name="ipt"]')
inp.addEventListener('input', function() {
    const text = this.value.trim()
    const script = document.createElement('script')
    script.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,33222,33306,33259,33235,32973,33351,33313,33312,33311,33310,33309,33308,33307,33145,22159,33389&wd=${text}&req=2&csor=4&pwd=aiq&cb=bindHtml&_=1608775410035`
        // 插入到 body 内部
    document.body.appendChild(script)
    script.remove()
})

function bindHtml(res) {
    if (!res.g) {
        ol.style.display = 'none'
        return
    }
    let str = ''
    res.g.forEach(item => {
        str += `
  <li>${item.q}</li>
`
    })
    ol.innerHTML = str
    ol.style.display = 'block'
}

//瀑布流
$(function() {
    const uls = document.querySelectorAll('.content>ul');
    let start = 0;
    // console.log(uls);

    //准备一个开关
    let flag = true;

    function getMinUl() {
        //找到最短的ul返回
        let minUl = uls[0];
        for (let i = 0; i < uls.length; i++) {
            if (uls[i].offsetHeight < minUl.offsetHeight) {
                //比我假设的高度段
                minUl = uls[i]
            }
        }
        return minUl;
    }
    //请求第一页的数据，把每一条渲染成一个li
    //找到最短的ul放进去
    getList()

    function getList() {
        if (!flag) return;
        flag = false;
        ajax({
            url: '/dt',
            data: {
                include_fields: 'top_comments,is_root,source_link,item,buyable,root_id,status,like_count,sender,album,reply_count',
                filter_id: '美食菜谱',
                start: start,
                _: 1608791577892
            },
            success: res => {
                // console.log(res);
                start = res.data.object_list;
                // console.log(start);
                bindHtml(res.data.object_list);

                //表示渲染页面完毕了
                flag = true;
            }

        })
    }
    // 渲染页面的函数

    function bindHtml(list) {
        // console.log(list);
        //循环遍历list
        list.forEach(item => {

            //计算每一个图片显示的高度
            const height = item.photo.height * 340 / item.photo.width
                //每一个item就是一个li
            const str = `
                <li>
                    <div class="top" style="height: ${ height }px">
                        <img src="${ item.photo.path }" alt="">
                    </div>
                    <div class="bottom">
                        <div class="title">${ item.msg }</div>
                        <div class="author">
                        <div class="avatar">
                            <img src="${ item.sender.avatar }" alt="">
                        </div>
                        <div class="name">
                            ${ item.sender.username }
                        </div>
                        </div>
                    </div>
                </li>
          `
                //每次都要找到最短的ul
            const min = getMinUl();
            //把本次组装的str添加到ul里面
            min.innerHTML += str;
        })
    }

    //加载第二页
    window.onscroll = function() {
        //卷曲高度
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            //可是窗口高
        const windowHeight = document.documentElement.clientHeight;
        //最短ul
        const minUl = getMinUl();
        //最短ul的高度
        const ulHeight = minUl.offsetHeight;
        //最短ul的上方偏移量
        const ulTop = minUl.offsetTop;
        //条件判断
        if (ulHeight + ulTop <= windowHeight + scrollTop) {
            // console.log('底边进来了')
            getList();
        }
    }
});


//登录
$('[name="login"]').on('click', () => {
    window.location.href = './login.html';
})

//注册
$('[name="res"]').on('click', () => {
    window.location.href = './res.html';
})