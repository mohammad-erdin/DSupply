<?php if (!defined('PC')) exit();


$response=new stdClass();


$str_qry = "SELECT a.*,b.Nama_Bahan from d_supply_detail as a
inner JOIN r_jenis_bahan as b
on a.ID_Jenis=b.ID_Jenis
where a.ID_Supply='$ID_Supply'
";

$response->rows = array();
$response->total_rows = mysql_num_rows(mysql_query($str_qry));
$qry = mysql_query($str_qry) or die(mysql_error());

while ($isi = mysql_fetch_assoc($qry)){
	$response->rows[] = $isi;
}

$response->success=true;
$response->test=$str_qry;
header("Content-type: application/json");
echo json_encode($response);
?>