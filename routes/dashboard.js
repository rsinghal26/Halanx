var express  = require("express");
var router   = express.Router();
var checkAuth = require("../middlewares/check_auth");
var dashboardController = require("../controllers/dashboardController");

router.get("/",checkAuth,dashboardController.get_stores);

router.get("/place/:id/openinghours",dashboardController.get_timings);

router.patch("/place/:id/openinghours",dashboardController.update_timings);

router.get("/plots/:id",checkAuth, dashboardController.get_plot_page);

router.get("/plots/:id/view", dashboardController.view_plot );

module.exports = router;