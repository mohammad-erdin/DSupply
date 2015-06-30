<?php
	function MysqlConnect(){
		global $MSQL_HOST, $MSQL_USER, $MSQL_PASSWORD, $MSQL_DATABASE ;
		$link = mysql_connect(MSQL_HOST, MSQL_USER, MSQL_PASSWORD) or die('Failed to connect to server: ' . mysql_error());
		$db = mysql_select_db(MSQL_DATABASE) or die("Unable to select database");
		return $link;
	}
	function clean($str){
		$str=@trim($str);
		if(get_magic_quotes_gpc())$str=stripslashes($str);
		return $str;
	}
	function cleanObj($row){
		foreach($row as $key=>$val)
			$row[$key]=trim($val);
		return $row;
	}
	function directoryToArray($directory, $recursive) {
		$array_items = array();
		if ($handle = opendir($directory)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
					if (is_dir($directory. "/" . $file)) {
						if($recursive) {
							$array_items = array_merge($array_items, directoryToArray($directory. "/" . $file, $recursive));
						}
						//$file = $directory . "/" . $file;
						$array_items[] = preg_replace("/\/\//si", "/", $file);
					} else {
						//$file = $directory . "/" . $file;
						$array_items[] = preg_replace("/\/\//si", "/", $file);
					}
				}
			}
			closedir($handle);
		}
		return $array_items;
	}
	function array_orderby(){
		$args = func_get_args();
		$data = array_shift($args);
		foreach ($args as $n => $field) {
			if (is_string($field)) {
				$tmp = array();
				foreach ($data as $key => $row)
					$tmp[$key] = $row[$field];
				$args[$n] = $tmp;
			}
		}
		$args[] = &$data;
		call_user_func_array('array_multisort', $args);
		return array_pop($args);
	}
?>