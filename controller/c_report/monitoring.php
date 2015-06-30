<?php if (!defined('PC')) exit();

$Data="";
$XLS = isset($_REQUEST["excell"])?true:false;


$NamaPimpinan="";
$NIKPimpinan="";
$qry = mysql_query("Select NIK,Nama from d_karyawan where Pimpinan='P'") or die(mysql_error());
if($qry && $isi = mysql_fetch_assoc($qry)){
	$NamaPimpinan=$isi["Nama"];
	$NIKPimpinan=$isi["NIK"];
}

$where="";
if (isset($DateStart) && isset($DateEnd) && trim($DateStart.$DateEnd)!="") 
	$where="where (Tgl_entry BETWEEN '$DateStart' and DATE_ADD('$DateEnd',INTERVAL 1 DAY))";

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
$where
GROUP BY ID_Cabang, ID_Jenis;";
$info = "Rekap Supply tgl $DateStart - $DateEnd";

if($XLS){	
	include '../core/php_excel/PHPExcel.php';
	include '../core/php_excel/PHPExcel/IOFactory.php';	

	header('Content-Type: application/vnd.ms-excel');
	header('Content-Disposition: attachment;filename="rekap-suppy.xlsx"');
	header('Cache-Control: max-age=0');  

	$excel = PHPExcel_IOFactory::createReader('Excel2007');
	$excel = $excel->load('../files/rekap.xlsx');
	$excel->setActiveSheetIndex(0);
	$border=array('style'=>PHPExcel_Style_Border::BORDER_THIN,'color'=>array('rgb'=>'000000'));
	$fill=array('fill'=>array('type'=>PHPExcel_Style_FILL::FILL_SOLID,'color'=>array('rgb'=>'eeeeee')));
	$qry = mysql_query($str_qry) or die(mysql_error());
	$nmCabang="";
	$x=0;
	$j=9;
	$excel->getActiveSheet()
		->setCellValue('A7', $info)
		->setCellValue('G7', "Tgl Cetak ".date('d M Y H:i:s'));
	while($qry && $isi = mysql_fetch_assoc($qry)){
		$x=($nmCabang!=$isi["Nama_Cabang"])?1:$x+1;
		$nmCabang=$isi["Nama_Cabang"];
		if($x==1){
			$excel->getActiveSheet()->mergeCells("A".$j.":I".$j)->setCellValue('A'.$j," ");$j++;
			$excel->getActiveSheet()->mergeCells("A".$j.":I".$j)->setCellValue('A'.$j,$nmCabang);
			$excel->getActiveSheet()->getStyle("A".$j.":I".$j)->applyFromArray($fill);
			$j++;
		}
		$excel->getActiveSheet()->mergeCells("B".$j.":F".$j);
		$excel->getActiveSheet()
			->setCellValue('A'.$j, $x)
			->setCellValue('B'.$j, $isi["Nama_Bahan"])
			->setCellValue('G'.$j, $isi["plus"])
			->setCellValue('H'.$j, $isi["min"])
			->setCellValue('I'.$j, ($isi["plus"]-$isi["min"]));
		$j++;
	}
	$excel->getActiveSheet()->getStyle("A9:I".($j-1))->getBorders()->getAllBorders()->applyFromArray($border);$j+=3;
	$excel->getActiveSheet()->mergeCells("G".$j.":I".$j);
	$excel->getActiveSheet()->setCellValue('G'.$j, "Pimpinan");
	$excel->getActiveSheet()->getStyle("G".$j.":I".$j)
		->applyFromArray(array('alignment'=>array('horizontal'=>PHPExcel_Style_Alignment::HORIZONTAL_CENTER)));$j+=5;
	$excel->getActiveSheet()->mergeCells("G".$j.":I".$j);
	$excel->getActiveSheet()->setCellValue('G'.$j, $NamaPimpinan);
	$excel->getActiveSheet()->getStyle("G".$j.":I".$j)
		->applyFromArray(array('alignment'=>array('horizontal'=>PHPExcel_Style_Alignment::HORIZONTAL_CENTER)));
	$excel->getActiveSheet()->getStyle("G".$j.":I".$j)->getBorders()->getBottom()->applyFromArray($border);$j++;
	$excel->getActiveSheet()->mergeCells("G".$j.":I".$j);
	$excel->getActiveSheet()->setCellValue('G'.$j, "NIK : ".$NIKPimpinan);
	$excel->getActiveSheet()->getStyle("G".$j.":I".$j)
		->applyFromArray(array('alignment'=>array('horizontal'=>PHPExcel_Style_Alignment::HORIZONTAL_CENTER)));

	$writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
	$writer->save('php://output');
}else{
	$qry = mysql_query($str_qry) or die(mysql_error());
	$nmCabang="";
	$x=0;
	while($qry && $isi = mysql_fetch_assoc($qry)){
		$x=($nmCabang!=$isi["Nama_Cabang"])?1:$x+1;
		$nmCabang=$isi["Nama_Cabang"];
		if($x==1){
			$Data.="<tr><td class='BL BR BB' colspan='5'>&nbsp;</td></tr>
					<tr><td class='BL BR BB' colspan='5' style='background-color:#D2D2D2'>$nmCabang</td></tr>";		
		}
		$Data.="
			<tr>
				<td class='BL BB' align='center'>$x</td>
				<td class='BL BB'>".$isi["Nama_Bahan"]."</td>
				<td class='BL BB' align='right'>".$isi["plus"]."</td>
				<td class='BL BB' align='right'>".$isi["min"]."</td>
				<td class='BL BR BB' align='right'>".($isi["plus"]-$isi["min"])."</td>
			</tr>
		";
	}
	if($x==0){
		$Data.="
			<tr>
				<td class='BL BB' align='center' colspan='5'>Data tidak tersedia / tidak ada</td>
			</tr>
		";
	}

	echo "
	<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">
	<html>
		<head>
			<title> Rekap Suply berdasarkan Supply</title>
			<style type='text/css'>
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
			<script type='text/javascript'>
			<!--
			function printPage(){
				window.print();
			}
			//-->
			</script>
		</head>
	 <body>
		<table cellpadding=2 cellspacing=0 style='width:21cm'>
			<tr>
				<td class='th' colspan='5'>
					<table width='100%' cellspacing=0>
						<tr>
							<td width='100px'><img src='../../resources/images/logo.png' width='100px'></td>
							<td align='center' valign='bottom'>
								".SITE_HEADER."<br>".SITE_SUBHEADER."<br><br>
								<span style='font-size:9px'>".SITE_KOPHEADER_ALAMAT."</span>
							</td>
							<td width='100px'>&nbsp;</td>
						</tr>
						<tr>
							<td colspan='3'><div style='border-top:solid 1px black;border-bottom:solid 2px black;height:1px'></div></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr height='30px'>
				<td colspan='2' align='left' valign='bottom'>$info</td>
				<td colspan='3' align='right' valign='bottom'>".date('d M Y H:i:s')."</td>
			</tr>
			<tr height='40px'>
				<th class='BL BT BB' style='background-color:#eeeeee;' width='30px;'>NO.</th>
				<th class='BL BT BB' style='background-color:#eeeeee;'>Nama Bahan</th>
				<th class='BL BT BB' style='background-color:#eeeeee;' width='80px'>Masuk</th>
				<th class='BL BT BB' style='background-color:#eeeeee;' width='80px'>Terpakai</th>
				<th class='BL BT BR BB' style='background-color:#eeeeee;' width='80px'>Sisa</th>
			</tr>
			".$Data."
			<tr height='200px' valign='bottom'>
				<td colspan='5' align='right'>
					<table style='margin-right:20px' width='200px'>
						<tr><td align='center'>Pimpinan</td></tr>
						<tr height='100px'><td align='center' valign='bottom' class='BB'>".$NamaPimpinan." </td></tr>
						<tr><td align='center'>NIK : ".$NIKPimpinan." </td></tr>
					</table>
				</td>
			</tr>
		</table>
	 </body>
	</html>
	";
}
?>