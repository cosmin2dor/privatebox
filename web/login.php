
<?php

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

   session_start();

   if(isset($_SESSION['customer_id'])) {
		header('Location: '."/pricing.php");
		die();
	}
   
   if($_SERVER["REQUEST_METHOD"] == "POST") {
      echo 'Trying to login';
      #TODO validate the id received
      if(isset($_POST['id'])){
      		$data = "{\"unique_id\":\"".$_POST['id']."\"}";
      		echo $data;
      		#TODO change to https
      		$result = callAPI("POST", "http://simplevpn.tech:8080/customer", $data);
	  		echo $result;
	  		$data = json_decode($result);
			$customer_id = $data->{'customer_id'};
			if($customer_id != null){
				$_SESSION['customer_id'] = $customer_id;
				header('Location: '."/pricing.php");
				die();
			}else{
				$error = "Failed to login. Invalid account number";
			}
	  }
   }
?>

<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>

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
	                <div calss="row">
	                    <div class="col-md-12">
	                        <h2 style="color:red"><?php echo $error; ?></h2>
	                    </div>
	                </div>
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
    <!-- End Section -->
    <?php //include 'footer.php'; ?>
    <?php include 'scripts.php'; ?>

  <!-- Charge Bee Script -->
  <script src="pricing.js"></script>
    </body>
</html>

