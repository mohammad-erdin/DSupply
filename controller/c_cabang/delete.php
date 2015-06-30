<?php if (!defined('PC')) exit();
$response=new stdClass();
$qry="delete from d_cabang where ID_Cabang='$ID_Cabang'";
$response->success=mysql_query($qry);

if(!$response->success){
	$response->msg = (mysql_errno()=="1451")
		?"Data cabang tidak dapat dihapus. <br>Terdapat karyawan pada data cabang ini.":mysql_error();
}

header("Content-type: application/json");
echo json_encode($response);
?>