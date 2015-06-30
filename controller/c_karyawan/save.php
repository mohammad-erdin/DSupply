<?php if (!defined('PC')) exit();
$qry="";

$response=new stdClass();
if($Act=="new") 
	$qry="insert into d_karyawan values ('$NIK','$Nama','$Jenkel','$Alamat','$Telp','$UserLogin',md5('$Password'),'$ID_Cabang')";
else {
	if($Pimpinan=="P"){
		@mysql_query("update d_karyawan set Pimpinan='K'");
		$response->msg ="Status pimpinan telah dialihkan";	
	}
	$psd = ($Password!="")?"Password=md5('$Password'), ":"";
	$qry="update d_karyawan set 
	Nama='$Nama',
	Jenkel='$Jenkel',
	Alamat='$Alamat',
	Telp='$Telp',
	UserLogin='$UserLogin',
	$psd
	ID_Cabang='$ID_Cabang',
	Pimpinan='$Pimpinan'
	where NIK='$NIK'";
}

$response->success=mysql_query($qry);
if(!$response->success){
	$response->msg = mysql_error();
}
header("Content-type: application/json");
echo json_encode($response);
?>