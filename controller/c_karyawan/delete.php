<?php if (!defined('PC')) exit();
$response=new stdClass();
$qry="delete from d_karyawan where NIK='$NIK'";
$response->success=mysql_query($qry);

if(!$response->success){
	$response->msg = mysql_error();
}

header("Content-type: application/json");
echo json_encode($response);
?>