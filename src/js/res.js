$(function() {
    $('[name="btn"]').click(async function() {
        const username = $('[name="name"]').val();
        const password = $('[name="pwd1"]').val();
        const nickname = $('[name="pwd2"]').val();
        if (!username || !password) return alert('账号密码不能为空');

        const { code } = await $.post('./server/zhuce.php', { username, password, nickname }, null, 'json')
        console.log(code);
        if (!code) return alert('注册失败');
        console.log('注册成功')
    })
})