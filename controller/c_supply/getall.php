<?php if (!defined('PC')) exit();


$response=new stdClass();


$start = isset($start) ? $start : 0;
$limit = isset($limit) ? $limit : 20;

$where=""; 
$whereA=array();
if (isset($DateStart) && isset($DateEnd) && trim($DateStart.$DateEnd)!="") $whereA[]="(Tgl_entry BETWEEN '$DateStart' and DATE_ADD('$DateEnd',INTERVAL 1 DAY))";
if (isset($Status) && $Status!="-" && $Status!="")$whereA[]="Status = '$Status'";
if (isset($NIK) && trim($NIK)!="")$whereA[]="b.NIK = '$NIK'";
if (isset($ID_Cabang) && trim($ID_Cabang)!="")$whereA[]="c.ID_Cabang = '$ID_Cabang'";
if (count($whereA)) $where = "where ". implode(" and ", $whereA);

$str_qry = "SELECT a.*,b.Nama,c.Nama as Nama_Cabang FROM
d_supply as a
INNER JOIN d_karyawan as b
on a.NIK=b.NIK
INNER JOIN d_cabang as c
on a.ID_Cabang=c.ID_Cabang
$where 
order by tgl_entry
";

$response->rows = array();
$response->where = $where;
$response->total_rows = mysql_num_rows(mysql_query($str_qry));
$qry = mysql_query($str_qry . " limit $start, $limit") or die(mysql_error());

while ($isi = mysql_fetch_assoc($qry)){
	$response->rows[] = $isi;
}



$response->test=$str_qry;
$response->success=true;
header("Content-type: application/json");
echo json_encode($response);
?>