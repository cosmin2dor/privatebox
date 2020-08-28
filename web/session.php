<?php
// Start the session
session_start();
$debug_key="cosmincacanarnr1";

if(isset($_GET["debug"]) && $_GET["debug"] == $debug_key )
	$_SESSION['debug'] = true;

if(isset($_SESSION['debug']) && $_SESSION['debug'] == true)
	var_dump($_SESSION);

if(isset($_GET["logout"]) && $_GET["logout"] == 1){
	unset($_SESSION["loggedin"]);
	unset($_SESSION["id"]);
	unset($_SESSION["portal_url"]);
	unset($_SESSION["customer_id"]);
	unset($_SESSION["active"]);
	header('Location: '."/index.php");
	die();
}

if(isset($_GET["generate"]) && $_GET["generate"] == 1 && !isset($_SESSION['loggedin'])) {

	$url = 'http://simplevpn.tech:8080/auth/generate';
	$json = file_get_contents($url);
	$data = json_decode($json);
	$id = $data->{'unique_id'};

	$_SESSION['loggedin']=true;
	$_SESSION['id'] = $id;

	#TODO get customer id from chargebee
	// $_SESSION['customer_id'] = "Azqgl4RyndL4Ggpe";

	#TODO check is user has active subscription
	// $_SESSION['active'] = true;
	header('Location: '."/pricing.php");
	die();
}

	
	// Getting manage portal if user has subscription

if (isset($_SESSION['customer_id']) && $_SESSION['customer_id'] == true) {

	$url = "https://simplevpn-test.chargebee.com/api/v2/portal_sessions";
	$username = 'test_gEPepb09gVloaa0D23VsUWX5Q3HcuiTnl'; // api_key
	$password = '';
	$myRequest = curl_init($url);
	$redirect_url = "http://simplevpn.tech";
	curl_setopt($myRequest, CURLOPT_POST, TRUE);
	curl_setopt($myRequest, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($myRequest, CURLOPT_USERPWD, "$username:$password");
	curl_setopt($myRequest, CURLOPT_POSTFIELDS,
            "customer[id]=".$_SESSION['customer_id']."&redirect_url=".$redirect_url);
	$response = curl_exec($myRequest);
	$statusCode = curl_getinfo($myRequest, CURLINFO_HTTP_CODE);
	curl_close($myRequest);
	$data = json_decode($response);
	$portal_url = $data->{'portal_session'}->{'access_url'};
	$_SESSION['portal_url'] = $portal_url;
}

?>
