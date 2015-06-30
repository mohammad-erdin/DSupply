<?php //if (!defined('PC')) exit();
$res=new stdClass();
$res->success = false;
$res->msg = "controller not found";
echo json_encode($res);
?>