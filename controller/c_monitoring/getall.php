<?php if (!defined('PC')) exit();

$response=new stdClass();

$str_qry = "SELECT 
c.ID_Cabang,c.Nama Nama_Cabang,
r.ID_Jenis,r.Nama_Bahan,r.Satuan_Bahan,
sum(IF(STATUS='In',Jumlah,0)) plus,
sum(IF(STATUS='Out',Jumlah,0)) min
FROM d_supply_detail d
JOIN d_supply s USING(ID_Supply)
JOIN r_jenis_bahan r USING(ID_Jenis)
JOIN d_cabang c USING(id_cabang)
GROUP BY ID_Cabang, ID_Jenis;";

$response->rows = array();
$response->total_rows = mysql_num_rows(mysql_query($str_qry));
$qry = mysql_query($str_qry) or die(mysql_error());

while ($isi = mysql_fetch_assoc($qry)){
	$response->rows[] = $isi;
}
$response->success=true;
header("Content-type: application/json");
echo json_encode($response);
?>
