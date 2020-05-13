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
                <li><a href="about-us.php">All about trust</a></li>
                <li><a href="pricing.php">Pricing</a></li>
            <ul class="attributes">
                <?php if(isset($_SESSION['loggedin'])) : ?>
                    <li class="header__button"><a href="pricing.php" class="btn btn-primary btn-rounded btn-xs btn-header">Account</a></li>
                    <?php if(isset($_SESSION['customer_id'])) : ?>
                    <li class="header__button"><a href="session.php?logout=1" class="btn btn-primary btn-rounded btn-xs btn-header">Log Out</a></li>
                    <?php endif; ?>
                <?php else : ?>
                    <li class="header__button"><a href="pricing.php?generate=1" class="btn btn-primary btn-rounded btn-xs btn-header">Generate Account</a></li>
                <?php endif; ?>
                <?php if(!isset($_SESSION['customer_id'])) : ?>
                <li class="header__button"><a href="login.php" class="btn btn-primary btn-rounded btn-xs btn-header">Log In</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <!-- End Header -->