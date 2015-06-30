<?php
define("PC",true);
ini_set('display_errors', "On");

session_start();

require_once '../config/site.php';
require_once '../config/database.php';
require_once '../core/function.php';

$client=MysqlConnect();
$path = SITE_SUBDIR."/controller/index.php";
$url = $_SERVER['PHP_SELF'];
$url = str_replace($path,"",$url);
$uri = preg_split('[\\/]', $url, -1, PREG_SPLIT_NO_EMPTY);
$file="c_".$uri[0]."/".$uri[1].".php";


foreach($_REQUEST as $k=>$v)$$k=clean($v);

if (file_exists($file))require_once($file);
elseif(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')
		require_once("notfound.php");
else header("Location: ".SITE_SUBDIR);
mysql_close($client);
?>