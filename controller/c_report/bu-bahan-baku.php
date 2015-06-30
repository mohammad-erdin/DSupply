<?php if (!defined('PC')) exit();

$Data="";
$XLS = isset($_REQUEST["excell"])?true:false;

if($XLS){
	header("Content-type: application/msexcel");
	header("Content-Disposition: attachment; filename=rekap_bahan.xls");	// the filename must end in .xls
	header("Pragma: no-cache");
	header("Expires: 0");
	$CLASS1 = "BorderXLS";
	$CLASS2 = "BorderXLS";
	$CLASS3 = "BorderXLS";
	$CLASS4 = "BorderXLS";
	$CLASS5 = "BorderXLS";
	$CLASS6 = "BorderXLS";
}else{	
	$CLASS1 = "BL BT BB";
	$CLASS2 = "BL BT BR BB";
	$CLASS3 = "BT BL  BB";
	$CLASS4 = "BL BB";
	$CLASS5 = "BL BR BB";
	$CLASS6 = "BL";
}


$NamaPimpinan="";
$NIKPimpinan="";
$qry = mysql_query("Select NIK,Nama from d_karyawan where Pimpinan='P'") or die(mysql_error());
if($qry && $isi = mysql_fetch_assoc($qry)){
	$NamaPimpinan=$isi["Nama"];
	$NIKPimpinan=$isi["NIK"];
}

//Get data
$str_qry = "
select 
c.ID_Cabang,c.Nama Nama_Cabang,
r.ID_Jenis,r.Nama_Bahan,r.Satuan_Bahan,
sum(IF(STATUS='In',Jumlah,0)) plus,
sum(IF(STATUS='Out',Jumlah,0)) min
FROM d_supply_detail d
JOIN d_supply s USING(ID_Supply)
JOIN r_jenis_bahan r USING(ID_Jenis)
JOIN d_cabang c USING(id_cabang)
GROUP BY ID_Jenis, ID_Cabang";

$qry = mysql_query($str_qry) or die(mysql_error());
$nmBahan="";
$x=0;
while($qry && $isi = mysql_fetch_assoc($qry)){
	$x=($nmBahan!=$isi["Nama_Bahan"])?1:$x+1;
	$nmBahan=$isi["Nama_Bahan"];
	if($x==1){
		$Data.="<tr><td class='$CLASS5' colspan='5'>&nbsp;</td></tr>
				<tr><td class='$CLASS5' colspan='5' style='background-color:#D2D2D2'>$nmBahan</td></tr>";		
	}
	$Data.="
		<tr>
			<td class='$CLASS4' align='center'>$x</td>
			<td class='$CLASS4'>".$isi["Nama_Cabang"]."</td>
			<td class='$CLASS4' align='right'>".$isi["plus"]."</td>
			<td class='$CLASS4' align='right'>".$isi["min"]."</td>
			<td class='$CLASS5' align='right'>".($isi["plus"]-$isi["min"])."</td>
		</tr>
	";
}



?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title> Rekap Suply berdasarkan Bahan Baku</title>
		<style type="text/css">
		body,table,thead,tr,td {font-family:Arial;font-size:10pt;}	
		.BorderXLS{border:.5pt solid windowtext;}
		.BB{border-bottom: solid 1px black;}
		.BL{border-left: solid 1px black;}
		.BR{border-right: solid 1px black;}
		.BT{border-top: solid 1px black;}
		.AC{text-align: center;}
		.AR{text-align: right;}
		.BG{background-color:#eeeeee;}
		.WH1{width:50px;}
		</style>
		<script type="text/javascript">
		<!--
		function printPage(){
			window.print();
		}
		//-->
		</script>
	</head>
 <body>
	<table cellpadding=2 cellspacing=0 style="width:21cm">
		<?php if(!$XLS){ ?>
			<tr>
				<td class="th" colspan='5'>
					<table width='100%' cellspacing=0>
						<tr>
							<td width="100px"><img src="../../resources/images/logo.png" width="100px"></td>
							<td align='center' valign='bottom'>
								<?php echo strtoupper(SITE_HEADER);?><br>
								<?php echo strtoupper(SITE_SUBHEADER);?><br><br>
								<span style='font-size:9px'><?php echo SITE_KOPHEADER_ALAMAT;?></span>
							</td>
							<td width="100px">&nbsp;</td>
						</tr>
						<tr>
							<td colspan="3"><div style="border-top:solid 1px black;border-bottom:solid 2px black;height:1px"></div></td>
						</tr>
					</table>
				</td>
			</tr>
		<?php }else{ ?>
			<tr><th class="th" colspan='5' ><?php echo strtoupper(SITE_HEADER);?></th></tr>
			<tr><th class="th BB" colspan='5'  valign="top" ><?php echo strtoupper(SITE_SUBHEADER);?></td></th>
			<tr><th class="th" colspan='5'><br><br></th></tr>
		<?php }?>
		<tr height='30px'>
			<td colspan='2' align='left' valign="bottom">Rekap Supply</td>
			<td colspan='3' align='right' valign="bottom"><?php echo date('d M Y h:i:s');?></td>
		</tr>
		<tr height='40px'>
			<th class="<?php echo $CLASS1?>" style="background-color:#eeeeee;" width='30px;'>NO.</th>
			<th class="<?php echo $CLASS1?>" style="background-color:#eeeeee;">Nama Bahan</th>
			<th class="<?php echo $CLASS1?>" style="background-color:#eeeeee;" width='80px'>Masuk</th>
			<th class="<?php echo $CLASS1?>" style="background-color:#eeeeee;" width='80px'>Terpakai</th>
			<th class="<?php echo $CLASS2?>" style="background-color:#eeeeee;" width='80px'>Sisa</th>
		</tr>
		<?php echo $Data;?>
		<tr height='200px' valign="bottom">
			<td colspan="5" align='right'>
				<table style="margin-right:20px" width="200px">
					<tr><td align='center'>Pimpinan</td></tr>
					<tr height='100px'><td align='center' valign="bottom" class="BB"><?php echo $NamaPimpinan;?></td></tr>
					<tr><td align='center'>NIK : <?php echo $NIKPimpinan;?></td></tr>
				</table>
			</td>
		</tr>
	</table>
 </body>
</html>
