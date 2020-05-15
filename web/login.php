
<?php
	session_start();

	function callAPI($method, $url, $data){
		$curl = curl_init();
		switch ($method){
		  case "POST":
		     curl_setopt($curl, CURLOPT_POST, 1);
		     if ($data)
		        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
		     break;
		  case "PUT":
		     curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
		     if ($data)
		        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);			 					
		     break;
		  default:
		     if ($data)
		        $url = sprintf("%s?%s", $url, http_build_query($data));
		}
		// OPTIONS:
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		  'Content-Type: application/json',
		));
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		// EXECUTE:
		$result = curl_exec($curl);
		if(!$result){die("Connection Failure");}
		curl_close($curl);
		return $result;
	}

	function get_customer_id($id){
		#TODO validate the id received
	$id = str_replace(' ', '', $id);
	if(!isset($id))
		return false;

	$data = "{\"unique_id\":\"".$id."\"}";
	#TODO change to https
	$result = callAPI("POST", 
					  "http://simplevpn.tech:8080/customer",
					  $data);
	echo $result;
	$data = json_decode($result);

	$customer_id = $data->{'customer_id'};
	if($customer_id == null)
		return false;

	$_SESSION['loggedin']=true;
	$_SESSION['customer_id'] = $customer_id;
	$_SESSION['id'] = $id;

	header('Location: '."/pricing.php?login=1");
	die();
	}
	#### START OF THE MAIN CODE ####

	if(isset($_SESSION['customer_id'])) {
		header('Location: '."/pricing.php");
		die();
	}
   
   if($_SERVER["REQUEST_METHOD"] == "POST") {
    if(get_customer_id($_POST['id']) == false)
    	$error = "Authentication failed.";
   }elseif(isset($_GET['id'])){
   	if(get_customer_id($_GET['id']) == false)
    	$error = "Authentication failed.";
   }
?>

<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>

    <div class="section__divider section__divider-right d-none d-lg-block"></div>

    <!-- Start Section -->
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">Welcome to the trusted VPN club!</h2>
                </div>
            </div>
        </div>
    </section>

	<!-- Start Section -->
	    <section class="section p0">
	        <div class="container">
	            <div class="section__cta section__cta-column section__cta-offset">
	                <div calss="row">
	                    <div class="col-md-12">
	                        <h2>Type in your account number: </h2>
	                    </div>
	                </div>
                	<?php if(isset($error)) : ?>
	                <div calss="row">
	                    <div class="col-md-12">
	                        <h2 style="color:red"><?php echo $error; ?></h2>
	                    </div>
	                </div>
                	<?php endif; ?>
	                <div calss="row">
	                    <div class="col-md-8 offset-lg-2">
	                        <fieldset class="section__cta-subscribe">
	                            <form action="" method="POST">
	                                <input name="id" type="number" class="section__cta-subscribe-input" placeholder="Your account number" />
	                                <button type="submit" class="btn btn-rounded btn-white section__cta-subscribe-button btn-icon-right">Log In <i class="fa fa-long-arrow-right"></i></button>
	                            </form>
	                        </fieldset>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </section>
    <div class="section__divider section__divider-right d-none d-lg-block"></div>


	 <section class="section pb-40">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">Trouble logining in?</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 offset-lg-2 text-center mb-40">
                    <p>
                     Check the most common problems.
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-gift column-icon"></span>
                        <h4>Forgot account number</h4>
                        <p>
                            Contact the support agents via the chat button in the corner and we'll sort it out.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Authenication failed</h4>
                        <p>
                            If you just bought a subscription it may take up to 10 minutes for the account to activate. 
                        <?php
                        echo 'If you haven\'t signed out this is your number: ';
                        $id = $_SESSION['id'];
                        echo(substr($id, 0, 4)." ");
                        echo(substr($id, 4, 4)." ");
                        echo(substr($id, 8, 4)." ");
                        echo(substr($id, 12, 4)." ");
                        ?>
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Only customers with subcriptions</h4>
                        <p>
                            If you don't have a subcription you can't login.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-cogs column-icon"></span>
                        <h4>Still having trouble?</h4>
                        <p>
                            Check out the support! We are happy to help.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- End Section -->
    <div class="section__divider section__divider-right d-none d-lg-block"></div>
    <?php include 'footer.php'; ?>
    <?php include 'scripts.php'; ?>

    </body>
</html>

