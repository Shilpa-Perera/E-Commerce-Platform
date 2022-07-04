const { CustomerController } = require("../controllers/customer");
const auth = require("../middleware/auth");
const authPage = require("../middleware/authPage");
const ROLE = require("../util/roles.json");
const express = require("express");
const { OrderController } = require("../controllers/order");
const router = express();

router.get(
    "/addresses",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.getCustomerAddresses
);
router.get(
    "/mobiles",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.getCustomerMobiles
);
router.get("/orders/:id", [auth], OrderController.getCustomerOrders);
router.get(
    "/",
    [auth, authPage([ROLE.ADMIN])],
    CustomerController.getAllCustomers
);
router.get(
    "/:id",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.getCustomer
);
router.post("/", CustomerController.postCustomer);
router.put(
    "/:id",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.updateCustomer
);
router.delete(
    "/addresses/:id",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.deleteCustomerAddress
);
router.delete(
    "/mobiles/:id",
    [auth, authPage([ROLE.ADMIN, ROLE.CUSTOMER])],
    CustomerController.deleteCustomerMobile
);

module.exports = router;
