<?php if (!defined('PC')) exit();

$response=new stdClass();

if($ID_Jenis=="") 
	$qry="insert into r_jenis_bahan values (null,'$Nama_Bahan','$Satuan_Bahan')";
else 
	$qry="update r_jenis_bahan set Nama_Bahan='$Nama_Bahan', Satuan_Bahan='$Satuan_Bahan' where ID_Jenis='$ID_Jenis'";

$response->success=mysql_query($qry);

header("Content-type: application/json");
echo json_encode($response);
?>