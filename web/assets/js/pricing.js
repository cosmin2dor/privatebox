document.addEventListener("DOMContentLoaded", function() {
      var cbInstance = Chargebee.getInstance();

      // To add addons
      // Get the element with the corresponding plan and addons
      var planElement = document.querySelector("[data-cb-plan-id='cbdemo_free']");
      var product = cbInstance.getProduct(planElement);
      // product.addons.push({id: "extra-comic-book", quantity: 2});

      // to add coupon
      // product.addCoupon("cbdemo_earlybird");

      // adding subscription custom fields
      // product.data["cf_generated_numer"] = 1234;

      // To add coupons and customer related information with custom fields
      var cart = cbInstance.getCart();
      // Date should be in YYYY-MM-DD
      // cart.setCustomer({email: "vivek@chargebee.com", cf_test: "customer custom field", cf_date: "1991-09-16"});
      var id = document.getElementById("unique-id").innerHTML;
      console.log(id)
      cart.setCustomer({cf_account_id: id});

      cbInstance.setCheckoutCallbacks(function(cart) {
        // You can get the plan name for which the checkout happened like below
        var product = cart.products[0];
        console.log(product.planId);
        console.log(product.addons);
        return {
            loaded: function() {
                // console.log("checkout opened");
            },
            close: function() {
                // console.log("checkout closed");
            },
            success: function(hostedPageId) {
              // console.log(hostedPageId);
              // Hosted page id will be unique token for the checkout that happened
              // You can pass this hosted page id to your backend 
              // and then call our retrieve hosted page api to get subscription details
              // https://apidocs.chargebee.com/docs/api/hosted_pages#retrieve_a_hosted_page
            },
            step: function(value) {
                // value -> which step in checkout
                // console.log(value);
          
            }
        }
      });
    });