<head>
    <?php include 'session.php'; ?>

    <title>Simple</title>

    <meta charset="utf-8">
    <meta name="keywords" content="saas, vpn, security, Privacy, simple, simplevpn, trust, community, peer-to-peer, p2p">
    <meta name="description" content="Simple VPN is a service that provides unrestricted internet access using a network powered by it's community.">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <!-- Template stylesheet -->
    <link rel="stylesheet" href="assets/css/style.min.css">
    <link rel="shortcut icon" href="assets/brand/logo2.png" type="image/x-icon">
</head>

    <body>

    <!-- Start Header -->
    <header class="header js-header-scroll">
        <nav hidden>
            <div class="nav-header">
                <a href="/index.php" class="brand">
                    <img src="assets/brand/logo2.png" class="logo" alt="SimpleVPN" width="15%" height="15%" />
                </a>
                <button class="toggle-bar">
                    <span class="fa fa-bars"></span>
                </button>
            </div>		
            <!-- Start Header menu for mobile -->
            <div class="header__mobile js-header-menu">
                <a href="#" class="header__mobile-brand">Menu</a>
                <button class="toggle-bar header__mobile-toggle">
                    <span class="fa fa-remove"></span>
                </button>
            </div>
            <!-- End Header menu for mobile -->	
            <ul class="menu">
                <li><a href="index.php">Home</a></li>
                <li><a href="about_us.php">All about trust</a></li>
                <li><a href="free.php">How it works</a></li>
                <?php if(isset($_SESSION['loggedin'])) : ?>
                    <li><a href="pricing.php" >Pricing</a></li>
                <?php else: ?>
                    <li><a href="pricing.php?generate=1">Pricing</a></li>
                <?php endif; ?>
            <!-- <ul class="attributes"> -->
                <?php if(isset($_SESSION['loggedin'])) : ?>
                    <li><a class="button btn-xs" href="pricing.php" >Account</a></li>
                    <?php if(isset($_SESSION['customer_id'])) : ?>
                    <li><a href="session.php?logout=1">Log Out</a></li>
                    <?php endif; ?>
                <?php else : ?>
                    <li><a href="pricing.php?generate=1">Generate Account</a></li>
                <?php endif; ?>
                <?php if(!isset($_SESSION['customer_id'])) : ?>
                <li><a href="login.php">Log In</a></li>
                <?php endif; ?>
            <!-- </ul> -->
        </nav>
    </header>
    <!-- End Header -->