<?php 

	session_start();
	require_once("config/site.php");

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><?php echo SITE_TITLE; ?></title>
		<link rel="stylesheet" type="text/css" href="resources/css/load.css" />
	</head>

	<body scroll="no">
	<div id="loading-mask"></div>
	<div id="loading">
		<div class="loading-indicator">
			<img src="resources/images/extanim32.gif" width="32" height="32" style="margin-right: 8px; float: left; vertical-align: middle;"/> 
			<span id="loading-msg">Loading styles and images...</span>
		</div>
	</div>
	<div class="hidden">
		<div id="header">
			<h1><?php echo SITE_HEADER;?></h1>
			<h6 style='font-size: 10px;'><i><?php echo SITE_SUBHEADER;?></i></h6>
		</div>
	</div>

	<link rel="stylesheet" type="text/css" href="resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/main.css" />
	<link rel="stylesheet" type="text/css" href="resources/css/icon.css" />

	<input type="text" name="sk" id="sk" style="display:none;visibility:hidden;" 
	value="<?php echo (isset($_SESSION["SESS_SECREATKEY"]) ) ? $_SESSION["SESS_SECREATKEY"]:Null;?>">


	<script type="text/javascript" src="view/static/ext-all.js"></script>
	<script type="text/javascript" src="view/texts/ext-lang-id.js"></script>
	<script type="text/javascript" src="view/static/egy.js"></script>
	<script type="text/javascript">
		Ext.Loader.setConfig({
			enabled:true,
			paths:{"App" : "view/apps",}
		});
		Ext.onReady(function(){
			Ext.ns("App");
			App.isDevel = function(){return true;}
			App.Utils = Ext.create("App.Utils");
			App.Login = Ext.create("App.Login");
		});
	</script>
	</body>
</html>
