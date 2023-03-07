<?php
$servername="127.0.0.1";
$username="root";
$password="Alan10/28";

try{
  $conn=new PDO("mysqli:host=$servername;dbname=crud",$username,$password);
  $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  echo"Connection successfully";
}catch(PDOException $e){
  echo "Connection failed".$e -> getMessage();
}

// $conn=new mysqli($servername,$username,$password);

// if(!$conn){
//   die("Connection failed" .mysqli_connect_error());
// }
// echo "Connection successfully";
?>