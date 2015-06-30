<?php

	
	$response = new stdClass();
	$response->success = true;
	$response->test = date_format(now(),"d M Y  h:i:s");

	header("Content-type : application/json");
	echo json_encode($response);;
?>