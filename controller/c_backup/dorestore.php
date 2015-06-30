<?php if (!defined('PC')) exit();
$response=new stdClass();
$response->success=true;
$command="mysql -u ".MSQL_USER." -p".MSQL_PASSWORD." ".MSQL_DATABASE." < ".
	getcwd()."\\..\\backup\\".$filename;
$response->test=$command;
@shell_exec($command);

header("Content-type: application/json");
echo json_encode($response);
?>