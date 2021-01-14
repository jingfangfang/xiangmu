<?php
$username = $_POST['username'];
$password = $_POST['password'];
$nickname = $_POST['nickname'];



  // 2. 去数据库查询比对
  // 2-1. 准备 sql 语句
  $sql1 = "INSERT INTO `users` (`username`,`password`,`nickname`) VALUES ('$username','$password','$nickname')";
  // 2-2. 连接数据库
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  // 2-3. 执行 sql 语句
  $res = mysqli_query($link, $sql1);
  // 2-4. 解析结果
  // 2-5. 关闭连接
  mysqli_close($link);

  if($res){
      $arr = array(
          "message" => "注册成功",
           "code" => 1
      );
  }else{
        $arr = array(
            "message" => "注册失败",
            "code" => 0
        );
  };
  echo json_encode($arr);
?>