<?php if (!defined('PC')) exit();


$response=new stdClass();


$start = isset($start) ? $start : 0;
$limit = isset($limit) ? $limit : 20;


$where="";
if(isset($Kata) && $Kata!="")$where.=" where Nama like '%$Kata%' or Alamat like '%$Kata%'";

$str_qry = "select * from d_cabang $where";
$response->rows = array();
$response->total_rows = mysql_num_rows(mysql_query($str_qry));
$qry = mysql_query($str_qry . " limit $start, $limit") or die(mysql_error());

while ($isi = mysql_fetch_assoc($qry)){
	$response->rows[] = $isi;
}



$response->success=true;
header("Content-type: application/json");
echo json_encode($response);
?>