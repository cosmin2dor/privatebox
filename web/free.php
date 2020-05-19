<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>
     
    <div class="section__divider section__divider-left"></div>


     <!-- Start Section -->
    <section class="section pb-40">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">How can we make this free? We will be honest. We need YOU.</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 offset-lg-2 text-center mb-40">
                    <h3>
                     SimpleVPN is a decentralized VPN solution that's powered by the community.</h3>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-gift column-icon"></span>
                        <h4>What's a VPN?</h4>
                        <p>
                            Virtual Private Network, allows you to create a secure connection to another network over the Internet.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Powered by the community</h4>
                        <p>
                            Users with the free subscription are made part of the network. As a free user you get a VPN for your internet.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Decentralized</h4>
                        <p>
                            There are many advantages to decentralized VPNs. In easier terms classic servers are swapped with dynamic personal hardware.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-cogs column-icon"></span>
                        <h4>What does it mean to give my internet</h4>
                        <p>
                            It means that we will be able to route traffic through your hardware to other parts of the network.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-flask column-icon"></span>
                        <h4>Are there risks?</h4>
                        <p>
                            We are constantly working to provide a state of the art service and keep bad guys out of the network.
                        </p>
                    </div>
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

