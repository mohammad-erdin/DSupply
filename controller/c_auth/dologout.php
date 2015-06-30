<?php
	session_unset();
	session_destroy();
	header("Content-type : application/json");
	echo "{'success':true}";
?>