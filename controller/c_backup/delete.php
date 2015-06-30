<?php if (!defined('PC')) exit();
$response=new stdClass();
$response->success=true;
$directory=getcwd()."\\..\\backup";
@unlink($directory."/".$filename);
header("Content-type: application/json");
echo json_encode($response);
?>