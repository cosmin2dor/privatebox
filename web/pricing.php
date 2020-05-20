<!doctype html>
<html lang="en">
    <?php include 'header.php'; ?>
    <?php if(!isset($_SESSION['customer_id'])) : ?>
    <script src="https://js.chargebee.com/v2/chargebee.js" data-cb-site="simplevpn-test" ></script>
    <?php endif; ?>


    <!-- Start Section -->
    <section class="section pb-60">

        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <h1></h1>
                    <h2 class="section__heading section__heading-center">Here's your account:
                    <div>
                        <?php
                        if(!isset($_SESSION['id'])){
                            header('Location: '."/pricing.php?generate=1");
                            die();
                        }
                        $id = $_SESSION['id'];
                        echo(substr($id, 0, 4)." ");
                        echo(substr($id, 4, 4)." ");
                        echo(substr($id, 8, 4)." ");
                        echo(substr($id, 12, 4)." ");
                        ?>
                    </div>
                    <button class="btn-primary btn btn-xs" data-clipboard-text="<?php
                        $id = $_SESSION['id'];
                        echo($id);
                        ?>">
                        Copy to Clipboard
                    </button>
                    <div id="unique-id" style="display: none;">
                        <?php
                        $id = $_SESSION['id'];
                        echo($id);
                        ?>
                    </div>
                    </h2>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-8 offset-lg-2 text-center mb-40">
                    <h3>
                        Save your account number on a piece of paper or on your computer safely. 
                        This is your way into the account.
                    </h3>

                    <h4 style="color:red">
                        We are currently in a testing period. All paid accounts are unavailable and subject to changes.
                    </h4>
                </div>
            </div>
            <?php
            if (isset($_SESSION['customer_id'])) {
                include 'manage_account.php';
            }
            include 'pricing_plans.php';
            ?>
        </div>
    </section>
    <!-- End Section -->

     <!-- Start Section -->
    <section class="section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 offset-lg-2">
                    <h2 class="text-center">Plans Comparison</h2>

                    <div class="table-responsve">
                    <table class="table table-striped table-hover">
                      <thead class="thead-inverse">
                        <tr>
                            <th class="w-25"></th>
                            <th class="">Basic</th>
                            <th class="">Premium</th>
                            <th class="">Ultra</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="option">Traffic Encryption</td>
                          <td><i class="fa fa-check"></i></td>
                          <td><i class="fa fa-check"></i></td>
                          <td><i class="fa fa-check"></i></td>
                        </tr>
                        <tr>
                          <td class="option">Customer Support</td>
                          <td>-</td>
                          <td><i class="fa fa-check"></i></td>
                          <td>Dedicated</td>
                        </tr>
                        <tr>
                          <td class="option">Being part of the network</td>
                          <td>Mandatory</td>
                          <td>Optional</td>
                          <td>Optional</i></td>
                        </tr>
                        <tr>
                          <td class="option">Speed</td>
                          <td>Medium</td>
                          <td>High</td>
                          <td>Highest</td>
                        </tr>
                        <tr>
                          <td class="option">Devices</td>
                          <td>1</td>
                          <td>5</td>
                          <td>Unlimited</td>
                        </tr>
                        <tr>
                          <td class="w-25 option">Countries</td>
                          <td class="">Top 20</td>
                          <td class="">Unlimited</td>
                          <td class="">Unlimited</td>
                        </tr>
                        <tr>
                          <td class="option">Gold Account Number</td>
                          <td>-</td>
                          <td>-</td>
                          <td><i class="fa fa-check"></i></td>
                        </tr>
                        <tr>
                          <td class="option">Personal Security Consultant</td>
                          <td>-</td>
                          <td>-</td>
                          <td><i class="fa fa-check"></i></td>
                        </tr>
                        <tr>
                          <td class="option">Cybersecurity Assessments</td>
                          <td>-</td>
                          <td>-</td>
                          <td><i class="fa fa-check"></i></td>
                        </tr>
                        <tr>
                          <td class="option">Target customer</td>
                          <td>Censored User</td>
                          <td>Media Consumer</td>
                          <td>VIP</td>
                        </tr>
                      </tbody>
                    </table>
            </div>
                </div>
            </div>
           </div>
   </section> 


    <!-- Charge Bee Script -->
      <script id="pricing-script-tag" src="assets/js/pricing.js" data-id=" <?php
                        $id = $_SESSION['id'];
                        echo($id);
                        ?>"></script>
      <script src="assets/js/clipboard.min.js"></script>
      <script>
        var clipboard = new ClipboardJS('.btn');

        clipboard.on('success', function(e) {
            console.log(e);
        });

        clipboard.on('error', function(e) {
            console.log(e);
        });
    </script>
    <?php include 'footer.php'; ?>
    <?php include 'scripts.php'; ?>
    </body>
</html>

