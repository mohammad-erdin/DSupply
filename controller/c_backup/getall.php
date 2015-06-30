<?php if (!defined('PC')) exit();


$response=new stdClass();
$response->rows = array();
$directory=getcwd()."\\..\\backup";
if ($handle = opendir($directory)) {
	while (false !== ($file = readdir($handle))) {
		if ($file != "." && $file != "..") {
			if (!is_dir($directory. "/" . $file)) {
				$f=explode("-", $file);
				$f=substr($f[1], 0,-4);
				$d= date_create_from_format("dmy_his",$f);
				$response->rows[] = array(
					"filename"=>preg_replace("/\/\//si", "/", $file),
					"date"=>date_format($d,"d M Y  h:i:s")
				);
			}
		}
	}
	closedir($handle);
}
$response->total_rows = count($response->rows);
$response->success=true;
header("Content-type: application/json");
echo json_encode($response);
?>