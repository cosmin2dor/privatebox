<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>

    <div class="section__divider section__divider-left"></div>
     <!-- Start Section -->
    <section class="section pb-40">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">SimpleVPN is a startup based in Romania.</h2>
                </div>
            </div>
           </div>
   </section> 
    <!-- End Section -->

    <section class="section pb-40">
        <div class="container">
            <div class="embed-responsive embed-responsive-4by3">
  <iframe class="embed-responsive-item" src="https://innovationlabs.ro/teams/TunnelPeer" allowfullscreen scrolling="no"></iframe>
    </div>
    <div class="section__divider section__divider-left"></div>
    </section> 

    <!-- Start Section -->
    <!-- Start Section -->
    <section class="section section__gray-watter--bottom">
        <div class="container">
            <div class="row mt-100">
                <div class="col-lg-6 offset-lg-3">
                    <h2 class="section__heading section__heading-center">The Team</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 offset-lg-3 text-center mb-20">
                    <div class="owl-carousel js-owl-testimoni">

                        <div class="item">
                            <div class="testimoni">
                                <blockquote>When I am not keeping the bad guys out of our network I love to cook exotic dishes.</blockquote>
                                <p class="testimoni__author"><a href="#">Vasile Andreiev</a></p>
                                <a class="testimoni__avatar"><img src="./assets/brand/vasile_andreiev.jpeg" class="testimoni__avatar-image" alt="Vasile Andreiev" /></a>
                            </div>
                        </div>

                        <div class="item">
                            <div class="testimoni">
                                <blockquote>Security Engineer turned Developer. Playing FIFA and hikes in the woods are a must.</blockquote>
                                <p class="testimoni__author"><a href="#">Stefan Bratescu</a></p>
                                <a class="testimoni__avatar"><img src="./assets/brand/stefan_bratescu.jpg" class="testimoni__avatar-image" alt="Stefan Bratescu" /></a>
                            </div>
                        </div>

                        <div class="item">
                            <div class="testimoni">
                                <blockquote>Developing simple solutions is my passion. Part-time writing, electric cars enthusiast.</blockquote>
                                <p class="testimoni__author"><a href="#">Cosmin Tudor</a></p>
                                <a class="testimoni__avatar"><img src="./assets/brand/cosmin_tudor.jpg" class="testimoni__avatar-image" alt="Cosmin Tudor" /></a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
     <!-- End Section -->
    <div class="section__divider section__divider-left"></div>

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

