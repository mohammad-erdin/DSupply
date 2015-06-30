<?php if (!defined('PC')) exit();


$response=new stdClass();

$str_qry = "select * from r_jenis_bahan";
$response->rows = array();
$qry = mysql_query($str_qry) or die(mysql_error());
while ($isi = mysql_fetch_assoc($qry)){
	$d=array();
	$d["key"]=$isi["ID_Jenis"];
	$d["value"]=$isi["Nama_Bahan"];
	$response->rows[] = $d;
}

$response->success=true;
header("Content-type: application/json");
echo json_encode($response);
?>