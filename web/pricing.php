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
                        $id = $_SESSION['id'];
                        echo(substr($id, 0, 4)." ");
                        echo(substr($id, 4, 4)." ");
                        echo(substr($id, 8, 4)." ");
                        echo(substr($id, 12, 4)." ");
                        ?>
                    </div>
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

    <!-- Charge Bee Script -->
      <script src="assets/js/pricing.js"></script>
    <?php include 'footer.php'; ?>
    <?php include 'scripts.php'; ?>
    </body>
</html>

