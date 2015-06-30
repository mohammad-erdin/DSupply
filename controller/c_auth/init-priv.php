<?php
	session_start();	
	$result = new stdClass();
	$result->success = true;
	$result->data = new stdClass();
	$result->data->memberId = $_SESSION['SESS_MEMBER_ID'];
	$result->data->name= $_SESSION['SESS_NAME'];
	//$result->data->usename = (int)$_SESSION['SESS_MEMBER_ID'];
	$result->data->add = (int)$_SESSION['SESS_PRIV_ADD'];
	$result->data->edit = (int)$_SESSION['SESS_PRIV_EDIT'];
	$result->data->delete = (int)$_SESSION['SESS_PRIV_DELETE']; 
	$result->data->upload = (int)$_SESSION['SESS_PRIV_UPLOAD'];
	//$result->data->download = (int)$_SESSION['SESS_PRIV_DOWNLOAD'];
	$result->data->generate = (int)$_SESSION['SESS_PRIV_GENERATE'];

	$result->data->hak = $_SESSION['SESS_PRIV_HAK'];
	$result->data->type = (int)$_SESSION['SESS_PRIV_TYPE'];
	$result->data->DF = true;
	
	header("Content-type : application/json");
	echo json_encode($result);
?>
