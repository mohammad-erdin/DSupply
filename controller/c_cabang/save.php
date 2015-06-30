<?php if (!defined('PC')) exit();

$response=new stdClass();

if($ID_Cabang=="") 
	$qry="insert into d_cabang values (null,'$Nama','$Alamat')";
else 
	$qry="update d_cabang set Nama='$Nama', Alamat='$Alamat' where ID_Cabang='$ID_Cabang'";

$response->success=mysql_query($qry);

header("Content-type: application/json");
echo json_encode($response);
?>