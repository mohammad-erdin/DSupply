<?php if (!defined('PC')) exit();
$id="";
$response=new stdClass();
$response->success=false;
$data=json_decode($detail);
$qry1="insert into d_supply(Tgl_entry,Status,NIK,ID_Cabang) values (now(),'$Status','".$_SESSION['SESS_NIK']."','$ID_Cabang')";
if(mysql_query($qry1)){
	$id=mysql_insert_id();
	$qry2="insert into d_supply_detail values ";
	foreach ($data as $r) {
		$qry2.=" ('$id','".$r->ID_Jenis."','".$r->Jumlah."'),";
	}
	$response->success=mysql_query(substr($qry2, 0,-1));
}
header("Content-type: application/json");
echo json_encode($response);
?>