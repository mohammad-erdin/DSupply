<?php if (!defined('PC')) exit();
$response=new stdClass();

$qry1="delete from d_supply_detail where ID_Supply='$ID_Supply'";
$qry2="delete from d_supply where ID_Supply='$ID_Supply'";

$response->success=mysql_query($qry1) && mysql_query($qry2);

if(!$response->success){
	$response->msg = mysql_error();
}

header("Content-type: application/json");
echo json_encode($response);
?>