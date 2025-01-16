// this is the test runner file we can make test files running order.
console.log("Unit test");
import "./Unit test/01_cus.signup.test.js";
import "./Unit test/02_cus.login.test.js";
import "./Unit test/03_seller_signup.test.js";
import "./Unit test/04_seller_login.test.js";
import "./Unit test/05_seller_add_product.test.js";
// import "./Unit test/06_cus_add_product&clear.test.js";
import "./Unit test/07_clear_product.test.js";
import "./Unit test/08_admin_delete_cus.test.js";
import "./Unit test/09_admin_delete_seller.test.js";
console.log("integration test");
import "./integration_test/admin.integration.test.js";
import "./integration_test/auth.integration.test.js";
import "./integration_test/seller.integration.test.js";
console.log("performance test");
import "./performance_test/apiPerformance.test.js";
import "./performance_test/paymentPerformance.test.js";
import "./performance_test/searchPerformance.test.js";

