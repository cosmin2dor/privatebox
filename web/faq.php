<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>
     <!-- Start Section -->
    <section class="section pb-40">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">Frequently Asked Questions</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-gift column-icon"></span>
                        <h4>Question?</h4>
                        <p>
                            Trust can only be built with transparency. In order to promote it we are publicly displaying our employees and our company. No more shady shell corporations.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Question?</h4>
                        <p>
                            A free VPN is has to be a community effort. Our free users will be part of our network. For more information please check <a href="/free.php"> here </a>.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-paper-plane column-icon"></span>
                        <h4>Question?</h4>
                        <p>
                            We are committed to providing state of the art experiences so your workflow just works with SimpleVPN.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-cogs column-icon"></span>
                        <h4>Question?</h4>
                        <p>
                            The product is developed with a security-first approach.
                        </p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="section__column section__column-left">
                        <span class="icon icon-flask column-icon"></span>
                        <h4>Question?</h4>
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

