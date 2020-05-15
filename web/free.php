<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>

    <section class="section pb-60">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h1></h1>
                    <h2 class="section__heading section__heading-center">
                        How can we make this free?
                    </h2>
                </div>
            </div>
     </section>

     <!-- Start Section -->
    <section class="section pb-40">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">We are building a simple VPN that you can trust. For real.</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 offset-lg-2 text-center mb-40">
                    <p>
                     No more sharing of contact information. No more weird interfaces. No more ads. That's SimpleVPN.
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-gift column-icon"></span>
                        <h4>Transparency</h4>
                        <p>
                            Trust can only be built with transparency. In order to promote it we are publicly displaying our employees and our company. No more shady shell corporations.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Community</h4>
                        <p>
                            A free VPN is has to be a community effort. Our free users will be part of our network. For more information please check <a href="/free.php"> here </a>.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Easy to use</h4>
                        <p>
                            We are committed to providing state of the art experiences so your workflow just works with SimpleVPN.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-cogs column-icon"></span>
                        <h4>Security first</h4>
                        <p>
                            The product is developed with a security-first approach.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-flask column-icon"></span>
                        <h4>New Technology</h4>
                        <p>
                            The latest protocol on the market. Wireguard is here to simplify the flow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End Section -->

    <div class="section__divider section__divider-right d-none d-lg-block"></div>

    <!-- Start Section -->
    <section class="section pt-40 pb-0 sm-clear-pt">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mb-40">
                    <img src="assets/images/using-software.png" class="img-fluid" alt="Using Software" />
                </div>
                <div class="col-lg-4 align-self-center mb-40">
                    <h2>About the account code</h2>
                    <p>
                    We value your privacy. In order to protect it we are devoted to not using your personal information. SimpleVPN uses generated account numbers that will be used as credentials into the our client.
                    </p>
                    <!-- <a href="#" class="btn btn-primary btn-rounded">Learn more </a> -->
                </div>
            </div>
        </div>
    </section>
    <!-- End Section -->
    
    <div class="section__divider section__divider-left"></div>

    <!-- Start Section -->
    <section class="section pt-0 pb-0">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 order-lg-4 mb-40">
                    <img src="assets/images/businessman-with-laptop.png" class="img-fluid" alt="Business Man with Laptop" />
                </div>
                <div class="col-lg-4 align-self-center mb-40">
                    <h2>Vision and Mission</h2>
                    <p>
                    Our mission is to create a VPN that's both free and trustworthy.
                    You no longer have to pay for the most basic VPN features.
                    </p>
                    <a href="#" class="btn btn-primary btn-rounded">Learn more </a>
                </div>
            </div>
        </div>
    </section>
    <!-- End Section -->
     
     <!-- End Section -->
    <?php include 'footer.php'; ?>
    <?php include 'scripts.php'; ?>

    <script> 
        drift.on('ready',function(api){
              api.widget.show()
            api.sidebar.open()
        //   // hide the widget when it first loads
        // api.widget.hide()
        //  // show the widget when you receive a message
        //   drift.on('message',function(e){
        //     if(!e.data.sidebarOpen){
        //     }
        //   })
        //   // hide the widget when you close the sidebar
        //     drift.on('sidebarClose',function(e){
        //       if(e.data.widgetVisible){
        //         api.widget.hide()
        //       }
        //     })
        //   })
    </script>

    </body>
</html>

