<?php
	session_start();
	$client=MysqlConnect();
	$username = $_SESSION['SESS_USERNAME'];
	$sql="select * from members where username='$username'";
	$qry=mysql_query($sql);
	$fetchUser=array();
	if($qry && $row=mysql_fetch_object($qry))$fetchUser[]=$row;
	echo json_encode($fetchUser);
	$_SESSION['SESS_MEMBER_ID'] = $fetchUser[0]->member_id;
	$_SESSION['SESS_USERNAME'] = $fetchUser[0]->username;
	$_SESSION['SESS_NAME'] = $fetchUser[0]->nama_lengkap;
	$_SESSION['SESS_PRIV_ADD'] = $fetchUser[0]->add;
	$_SESSION['SESS_PRIV_EDIT'] = $fetchUser[0]->edit;
	$_SESSION['SESS_PRIV_DELETE'] = $fetchUser[0]->delete;
	$_SESSION['SESS_PRIV_UPLOAD'] = $fetchUser[0]->upload;
	$_SESSION['SESS_PRIV_GENERATE'] = $fetchUser[0]->generate;
	$_SESSION['SESS_PRIV_HAK'] = $fetchUser[0]->hak;
	$_SESSION['SESS_PRIV_TYPE'] = $fetchUser[0]->type;
	header("Content-type : application/json");
	echo "{'success':true}";
	mysql_close($client);
?>