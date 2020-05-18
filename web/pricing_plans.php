<div class="row">
                <div class="col-lg-10 offset-lg-1">
                    <div class="pricing">
                        <!-- Start pricing 1-->
                        <div class="pricing__column pricing__green pp-fist">
                            <div class="pricing__heading">
                                <i class="fa fa-paper-plane pricing__icon"></i>
                                <h3 class="text-normal">Basic</h3>
                            </div>
                            <div class="pricing__content">
                                <p>
                                    Exactly
                                    <span class="pricing__content-price">
                                        <em class="pricing__content-currency">$</em>
                                        0
                                    </span>
                                    <small class="pricing__content-muted">/mo</small>
                                </p>
                                <a href="#" class="pricing__content-package" data-toggle="modal" data-target="#besicPackage">What’s included ?</a>
                            </div>
                            <?php if(!isset($_SESSION['customer_id'])) : ?>
                            <div class="pricing__action">
                                <button type="button" class="btn btn-green btn-stroke btn-rounded pricing__button"><a href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="cbdemo_free" style="color:#000000;" >Choose Plan</a></button>
                            </div>
                            <?php endif; ?>
                        </div>
                        <!-- End pricing 1-->

                        <!-- Start pricing 2-->
                        <div class="pricing__column pricing__popular">
                            <div class="pricing__heading">
                                <i class="fa fa-shield pricing__icon"></i>
                                <h3>Premium</h3>
                            </div>
                            <div class="pricing__content">
                                <p>
                                    From
                                    <span class="pricing__content-price">
                                        <em class="pricing__content-currency">$</em>
                                        5
                                    </span>
                                    <small class="pricing__content-muted">/mo</small>
                                </p>
                                <a href="#" class="pricing__content-package" data-toggle="modal" data-target="#premiumPackage">What’s included ?</a>
                            </div>
                            <?php if(!isset($_SESSION['customer_id'])) : ?>
                            <div class="pricing__action">
                                <button type="button" class="btn btn-primary btn-stroke btn-rounded pricing__button disabled"><!-- <a href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="premium" style="color:#000000;">Choose Plan</a> -->
                                    Unavailable
                                </button>
                            </div>
                            <?php endif; ?>
                        </div>
                        <!-- End pricing 2-->

                        <!-- Start pricing 3-->
                        <div class="pricing__column  pricing__red pp-last">
                            <div class="pricing__heading">
                                <i class="fa fa-rocket pricing__icon"></i>
                                <h3 class="text-normal">Ultra</h3>
                            </div>
                            <div class="pricing__content">
                                <p>
                                    From
                                    <span class="pricing__content-price">
                                        <em class="pricing__content-currency">$</em>
                                        599
                                    </span>
                                    <small class="pricing__content-muted">/mo</small>
                                </p>
                                <a href="#" class="pricing__content-package" data-toggle="modal" data-target="#businessPackage">What's included ?</a>
                            </div>
                            <?php if(!isset($_SESSION['customer_id'])) : ?>
                            <div class="pricing__action">
                                <button type="button" class="btn btn-red btn-stroke btn-rounded pricing__button">
                                <!-- <a href="javascript:void(0)" data-cb-type="checkout" data-cb-plan-id="ultra" style="color:#000000;">Choose Plan</a> -->
                                Unavailable
                                </button>
                            </div>
                            <?php endif; ?>
                        </div>
                        <!-- End pricing 3-->
                    </div>
                </div>
            </div>