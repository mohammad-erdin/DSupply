<?php if (!defined('PC')) exit();
$response=new stdClass();
$response->success=true;
$command="mysqldump -u ".MSQL_USER." -p".MSQL_PASSWORD." ".MSQL_DATABASE." > ".
	getcwd()."\\..\\backup\\".MSQL_DATABASE."-".date("dmy_his").".sql";
@shell_exec($command);
$response->test=$command;
header("Content-type: application/json");
echo json_encode($response);
?>