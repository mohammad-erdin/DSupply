<?php if (!defined('PC')) exit();


$response=new stdClass();


$start = isset($start) ? $start : 0;
$limit = isset($limit) ? $limit : 20;

$where=""; 
$whereA=array();
if (isset($NIK) 		&& trim($NIK)!=""		)$whereA[]="a.NIK like '%$NIK%'";
if (isset($Nama) 		&& trim($Nama)!=""		)$whereA[]="a.Nama like '%$Nama%'";
if (isset($Alamat) 		&& trim($Alamat)!=""	)$whereA[]="a.Alamat like '%$Alamat%'";
if (isset($Telp) 		&& trim($Telp)!=""		)$whereA[]="a.Telp like '%$Telp%'";
if (isset($ID_Cabang) 	&& trim($ID_Cabang)!=""	)$whereA[]="a.ID_Cabang = '$ID_Cabang'";
if (isset($Jenkel) 		&& $Jenkel!="-" 	&& $Jenkel!=""	)$whereA[]="a.Jenkel = '$Jenkel'";
if (isset($Pimpinan) 	&& $Pimpinan!="-" 	&& $Pimpinan!="")$whereA[]="a.Pimpinan = '$Pimpinan'";
if (count($whereA)) $where = "where ". implode(" or ", $whereA);


$str_qry = "select a.*,b.Nama Nama_Cabang 
from d_karyawan a INNER JOIN d_cabang b
on a.ID_Cabang=b.ID_Cabang
$where
order by NIK
";
$response->test = $str_qry;
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