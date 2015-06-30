<?php if(!defined("PC"))exit();
	$response = new stdClass();

	$nik = clean($_POST['nik']);
	$password = clean($_POST['password']);

	$response->success = true;
	$response->login = true;
	$response->errorMsg= array();

	if ($nik==''){
		$response->login = false;
		$error = new stdClass;
		$error->inp = "nik";
		$error->reason = "Kolom NIK tidak boleh kosong";
		$response->errorMsg[]=$error;
	}
	if ($response->login){		
		$sql="select * from d_karyawan where nik='$nik' and UserLogin='1'";
		$row=null;
		if($qry=mysql_query($sql)) {
			$row=mysql_fetch_assoc($qry);
		}

		$response->test =$row;
		if (!$row){
			$response->login = false;
			$error = new stdClass;
			$error->inp = "nik";
			$error->reason = "NIK karyawan tidak ditemukan";
			$response->errorMsg[]=$error;
		}
		if ($row["Password"] != md5($password)){
			$response->login = false;
			$error = new stdClass;
			$error->inp = "password";
			$error->reason = "password salah";
			$response->errorMsg[]=$error;
		}

		if($response->login){
			session_regenerate_id();
			$_SESSION['SESS_SECREATKEY'] = session_id();
			$_SESSION['SESS_NIK'] = $row["NIK"];
			$_SESSION['SESS_NAME'] = $row["Nama"];
			session_write_close();
			$response->login = true;
			unset($response->errorMsg);
		}
	}
	header("Content-type : application/json");
	echo json_encode($response);
?>
