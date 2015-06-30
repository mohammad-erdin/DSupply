<?php if (!defined('PC')) exit();
$response=new stdClass();
$qry="delete from r_jenis_bahan where ID_Jenis='$ID_Jenis'";
$response->success=mysql_query($qry);

if(!$response->success){
	$response->msg = (mysql_errno()=="1451")
		?"Data Bahan tidak dapat dihapus. <br>Terdapat data transaksi menggunakan data ini.":mysql_error();
}

header("Content-type: application/json");
echo json_encode($response);
?>