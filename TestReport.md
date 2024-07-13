# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

![Dependency graph](/assets/images/Dependency_graph/Dependency%20graph.png)

# Integration approach

    Bottom-up integration:
    
    -Step 1: DAO units
    -Step 2: DAOs+Controllers
    -Step 3: DAOs+Controllers+Routes

# Tests

<h1>Users</h1>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|GET /users/|userRoutes=>router.get(“/”,..) |Unit|WB/branch coverage|
|GET /users/roles/:role|userRoutes=>router.get(“/roles/:role”,..) |Unit|WB/branch coverage|
|GET /users/roles/:role fail|userRoutes=>router.get(“/roles/:role”,..) |Unit|WB/branch coverage|
|GET /users/:username|userRoutes=>router.get(“/:username”,..) |Unit|WB/branch coverage|
|DELETE /users/:username|userRoutes=>router.delete(“/:username”,..) |Unit|WB/branch coverage|
|DELETE /users/|userRoutes=>router.delete(“/”,..) |Unit|WB/branch coverage|
|PATCH /users/:username|userRoutes=>router.patch(“/:username”,...)|Unit|WB/branch coverage|
|Controller getUsers success|userController=>getUsers()|Unit|WB/branch coverage|
|Controller getUsersByRole success|userController=>getUsersByRole()|Unit|WB/branch coverage|
|Controller getUserByUsername success|userController=>getUserByUsername()|Unit|WB/branch coverage|
|Controller getUserByUsername fail|userController=>getUserByUsername()|Unit|WB/branch coverage|
|Controller deleteUser success|userController=>deleteUser()|Unit|WB/branch coverage|
|Controller deleteUser delete admin error|userController=>deleteUser()|Unit|WB/branch coverage|
|Controller deleteUser not admin caller err|userController=>deleteUser()|Unit|WB/branch coverage|
|Controller deleteAll success|userController=>deleteAll()|Unit|WB/branch coverage|
|Controller updateUserInfo success|userController=>updateUserInfo()|Unit|WB/branch coverage|
|Controller updateUserInfo unauthorised|userController=>updateUserInfo()|Unit|WB/branch coverage|
|DAO getUsers success|userDAO=>getUsers()|Unit|WB/branch coverage|
|DAO getUsers error|userDAO=>getUsers()|Unit|WB/branch coverage|
|DAO getUsersByRole success|userDAO=>getUsersByRole()|Unit|WB/branch coverage|
|DAO getUserByUsername success|userDAO=>getUserByUsername()|Unit|WB/branch coverage|
|DAO deleteUser success|userDAO=>deleteUser()|Unit|WB/branch coverage|
|DAO deleteUser error|userDAO=>deleteUser()|Unit|WB/branch coverage|
|DAO deleteAll success|userDAO=>deleteAll()|Unit|WB/branch coverage|
|DAO updateUser success|userDAO=>updateUser()|Unit|WB/branch coverage|
|POST /users/ success|POST /users/ API|API|BB/eq partitioning|
|POST /users/ missing parameter|POST /users/ API|API|BB/eq partitioning|
|POST /users/ already existing username|POST /users/ API|API|BB/eq partitioning|
|GET /users/ success|GET /users/ API|API|BB/eq partitioning|
|GET /users/ not admin|GET /users/ API|API|BB/eq partitioning|
|GET /users/roles/:role success|GET /users/roles/:role API|API|BB/eq partitioning|
|GET /users/roles/:role invalid role|GET /users/roles/:role API|API|BB/eq partitioning|
|GET /users/roles/:role not admin|GET /users/roles/:role API|API|BB/eq partitioning|
|GET /users/:username success|GET /users/:username API|API|BB/eq partitioning|
|GET /users/:username user not exist|GET /users/:username API|API|BB/eq partitioning|
|GET /users/:username unauthorised|GET /users/:username API|API|BB/eq partitioning|
|DELETE /users/:username success|DELETE /users/:username API|API|BB/eq partitioning|
|DELETE /users/:username user not exist|DELETE /users/:username API|API|BB/eq partitioning|
|DELETE /users/:username unauthorised|DELETE /users/:username API|API|BB/eq partitioning|
|DELETE /users/ success|DELETE /users/ API|API|BB/eq partitioning|
|DELETE /users/ unauthorised|DELETE /users/ API|API|BB/eq partitioning|
|PATCH /users/:username success|PATCH /users/:username API|API|BB/eq partitioning|
|PATCH /users/:username unauthorised|PATCH /users/:username API|API|BB/eq partitioning|
|DELETE /sessions/current success|DELETE /sessions/current API|API|BB/eq partitioning|
|DELETE /sessions/current not logged in|DELETE /sessions/current API|API|BB/eq partitioning|
|GET /sessions/current success|GET /sessions/current API|API|BB/eq partitioning|
|GET /sessions/current not logged in|GET /sessions/current API|API|BB/eq partitioning|
|createUser DAO+Controller|createUser DAO+Controller|DAO+Controller|BB/eq partitioning|
|createUser DAO+Controller|createUser DAO+Controller|DAO+Controller|BB/eq partitioning|
|getUsers DAO+Controller|getUsers DAO+Controller|DAO+Controller|BB/eq partitioning|
|getUsersByRole DAO+Controller|getUsersByRole DAO+Controller|DAO+Controller|BB/eq partitioning|
|getUsersByUsername DAO+Controller|getUsersByUsername DAO+Controller|DAO+Controller|BB/eq partitioning|
|getUsersByUsername DAO+Controller|getUsersByUsername DAO+Controller|DAO+Controller|BB/eq partitioning|
|deleteUser DAO+Controller|deleteUser DAO+Controller|DAO+Controller|BB/eq partitioning|
|deleteUser DAO+Controller|deleteUser DAO+Controller|DAO+Controller|BB/eq partitioning|
|deleteAll DAO+Controller|deleteAll DAO+Controller|DAO+Controller|BB/eq partitioning|
|updateUser DAO+Controller|updateUser DAO+Controller|DAO+Controller|BB/eq partitioning|
|updateUser DAO+Controller|updateUser DAO+Controller|DAO+Controller|BB/eq partitioning|

<h1>Products</h1>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|GET/ products/|productRoutes=>router.get(“/”,..)|Unit|WB/branch coverage|
|GET/ products/available|productRoutes=>router.get(“/available”,..)|Unit|WB/branch coverage|
|PATCH/ products/:model|productRoutes=>router.patch“/:model”,..)|Unit|WB/branch coverage|
|PATCH/ products/:model/sell|productRoutes=>router.patch“/:model/sell”,..)|Unit|WB/branch coverage|
|DELETE/ products|productRoutes=>router.delete“/”,..)|Unit|WB/branch coverage|
|DELETE/ products/:model|productRoutes=>router.delete“/:model”,..)|Unit|WB/branch coverage|
|Controller changeProductQuantity |productController=>changeProductQuantity ()|Unit|WB/branch coverage|
|Controller sellProduct success|productController=>sellProduct ()|Unit|WB/branch coverage|
|Controller sellProduct throws EmptyProductStockError|productController=>sellProduct ()|Unit|WB/branch coverage|
|Controller sellProduct throws LowProductStockError|productController=>sellProduct ()|Unit|WB/branch coverage|
|Controller getProduct success|productController=>getProduct ()|Unit|WB/branch coverage|
|Controller getProduct error|productController=>getProduct ()|Unit|WB/branch coverage|
|Controller getAvailableProducts category success|productController=>getAvailableProducts  ()|Unit|WB/branch coverage|
|Controller getAvailableProducts  model success|productController=>getAvailableProducts  ()|Unit|WB/branch coverage|
|Controller getAvailableProducts all success|productController=>getAvailableProducts  ()|Unit|WB/branch coverage|
|Controller deleteProduct model success|productController=>deleteProduct()|Unit|WB/branch coverage|
|Controller deleteProduct category success|productController=>deleteProduct()|Unit|WB/branch coverage|
|Controller deleteAll|productController=>deleteAll()|Unit|WB/branch coverage|
|DAO getAllProduct success|productDAO=>getAllProducts()|Unit|WB/branch coverage|
|DAO getAllProduct reject with ProductNotFoundError|productDAO=>getAllProducts()|Unit|WB/branch coverage|
|DAO getProductsByCategory success|productDAO=>getProductsByCategory()|Unit|WB/branch coverage|
|DAO reject with ProductNotFoundError|productDAO=>getProductsByCategory()|Unit|WB/branch coverage|
|DAO changeProductQuantity success|productDAO=>changeProductQuantity()|Unit|WB/branch coverage|
|DAO deleteAllProducts success|productDAO=>deleteAllProducts()|Unit|WB/branch coverage|
|DAO deleteProductsuccess|productDAO=>deleteProduct()|Unit|WB/branch coverage|
|DAO getProducts success|productDAO=> getProduct()|Unit|WB/branch coverage|
|POST /products 422 format error|POST /product API|API|BB/ eq partitioning|
|POST /products 401 unauthorised|POST /product API|API|BB/ eq partitioning|
|PATCH /products/:model 422 format error|PATCH /products/:model API|API|BB/ eq partitioning|
|PATCH /products/:model/sell 422 format error|PATCH /products/:model/sell API|API|BB/ eq partitioning|
|PATCH /products/:model/sell 401 unauthorised|PATCH /products/:model/sell API|API|BB/ eq partitioning|
|GET /products 422 format error|GET /products API|API|BB/ eq partitioning|
|GET /products 401 unauthorised|GET /products API|API|BB/ eq partitioning|
|GET /products/available 422 format error|GET /products API|API|BB/ eq partitioning|
|GET  /products/available 401 unauthorised|GET /products API|API|BB/ eq partitioning|
|DELETE /products/:model 401 unauthorised|DELETE /products/:model API|API|BB/ eq partitioning|
|DELETE /products 401 unauthorised|DELETE /products/ API|API|BB/ eq partitioning|

<h1>Reviews</h1>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|POST /reviews/:model  200 success|Review POST /reviews/:model API|API|BB/ eq partitioning|
|POST /reviews/:model 422 format error|Review POST /reviews/:model API|API|BB/ eq partitioning|
|POST /reviews/:model 401 Unauthorised|Review POST /reviews/:model API|API|BB/ eq partitioning|
|POST /reviews/:model 409 ExistingReviewError|Review POST /reviews/:model API|API|BB/ eq partitioning|
|POST /reviews/:model 404 ProductNotFoundError|Review POST /reviews/:model API|API|BB/ eq partitioning|
|GET /reviews/:model 200 success|Review GET /reviews/:model API|API|BB/ eq partitioning|
|GET /reviews/:model 401 unauthorised|Review GET /reviews/:model API|API|BB/ eq partitioning|
|DELETE /reviews/:model 404 NoReviewProductError|DELETE /reviews/:model API|API|BB/ eq partitioning|
|DELETE /reviews/:model 404 ProductNotFound|DELETE /reviews/:model  API|API|BB/ eq partitioning|
|DELETE /reviews/:model 401 unauthorised|DELETE /reviews/:model API|API|BB/ eq partitioning|
|DELETE /reviews/:model 200 success|DELETE /reviews/:model API|API|BB/ eq partitioning|
|DELETE /reviews/:model/all|DELETE /reviews/:model/all API|API|BB/ eq partitioning|
|DELETE /reviews/:model/all 404 ProductNotFound|DELETE /reviews/:model/all API|API|BB/ eq partitioning|
|DELETE /reviews 401 unauthorised|DELETE /reviews API|API|BB/ eq partitioning|
|DELETE /reviews success 200|DELETE /reviews API|API|BB/ eq partitioning|
|Test successful operation|addReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|404 ProductNotFound|addReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|409 ExistingReviewError|addReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|getProductReviews DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|deleteReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|404 ProductNotFound|deleteReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|404 NoReviewProductError|deleteReview DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Successful operation|deleteReviewsOfProduct DAO+Controller|DAO+Controller|BB/ eq partitioning|
|404 ProductNotFound|deleteReviewsOfProduct DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Successful operation|deleteAllReviews DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Controller addReview|reviewController=>addReview|Unit|WB/branch coverage|
|Controller getProductReviews|reviewController=>getProductReviews|Unit|WB/branch coverage|
|Controller deleteReview|reviewController=>deleteReview|Unit|WB/branch coverage|
|Controller deleteReviewsofProduct|reviewController=>deleteReviewsofProduct|Unit|WB/branch coverage|
|Controller deleteAllReviews|reviewController=>deleteAllReviews|Unit|WB/branch coverage|
|DAO addReview|reviewDAO=>addReview|Unit|WB/branch coverage|
|DAO getProductReviews|reviewDAO=>getProductReviews|Unit|WB/branch coverage|
|DAO deleteReview|reviewDAO=>deleteReview|Unit|WB/branch coverage|
|DAO deleteReviewsOfProduct|reviewDAO=>deleteReviewsOfProduct|Unit|WB/branch coverage|
|DAO deleteAllReviews|reviewDAO=>deleteAllReviews|Unit|WB/branch coverage|
|GET getProductReviews|reviewRoutes=>getProductReviews|Unit|WB/branch coverage|
|DELETE deleteReview|reviewRoutes=>deleteReview|Unit|WB/branch coverage|
|DELETE deleteReviewsOfProduct|reviewRoutes=>deleteReviewsOfProduct|Unit|WB/branch coverage|
|DELETE deleteAllReviews|reviewRoutes=>deleteAllReviews|Unit|WB/branch coverage|
|POST addReview|reviewRoutes=>addReview|Unit|WB/branch coverage|

<h1>Carts</h1>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|POST /carts 200 success|POST /carts API|API|BB/ eq partitioning|
|POST /carts 401 unauthorised|POST /carts API|API|BB/ eq partitioning|
|POST /carts 422 format error|POST /carts API|API|BB/ eq partitioning|
|POST /carts 404 ProductNotFound|POST /carts API|API|BB/ eq partitioning|
|POST /carts 409 EmptyProductStock|POST /carts API|API|BB/ eq partitioning|
|GET /carts 401 unauthorised|GET /carts API|API|BB/ eq partitioning|
|GET /carts 200 success|GET /carts API|API|BB/ eq partitioning|
|PATCH /carts 200 success|PATCH /carts API|API|BB/ eq partitioning|
|PATCH /carts 401 unauthorised|PATCH /carts API|API|BB/ eq partitioning|
|PATCH /carts 404 CartNotFound|PATCH /carts API|API|BB/ eq partitioning|
|GET /carts/history 200 success|GET /carts/history API|API|BB/ eq partitioning|
|GET /carts/history 401 unauthorised|GET /carts/history API|API|BB/ eq partitioning|
|DELETE /carts/products/:model 200 success|DELETE /carts/products/:model API|API|BB/ eq partitioning|
|DELETE /carts/products/:model 404 ProductNotInCart|DELETE /carts/products/:model API|API|BB/ eq partitioning|
|DELETE /carts/current 200 success|DELETE /carts/current API|API|BB/ eq partitioning|
|DELETE /carts/current 401 unauthorised|DELETE /carts/current API|API|BB/ eq partitioning|
|DELETE /carts/current 404 CartNotFound|DELETE /carts/current API|API|BB/ eq partitioning|
|DELETE /carts 200 success|DELETE /carts API|API|BB/ eq partitioning|
|DELETE /carts 401 unauthorised|DELETE /carts API|API|BB/ eq partitioning|
|GET /carts/all 200 success|GET /carts/all API|API|BB/ eq partitioning|
|Controller addToCart|cartController=>addToCart|Unit|WB/branch coverage|
|Controller getCart|cartController=>getCart|Unit|WB/branch coverage|
|Controller checkoutCart|cartController=>checkoutCart|Unit|WB/branch coverage|
|Controller getCustomerCarts|cartController=>getCustomerCarts|Unit|WB/branch coverage|
|Controller removeProductFromCart|cartController=>removeProductFromCart|Unit|WB/branch coverage|
|Controller clearCart|cartController=>clearCart|Unit|WB/branch coverage|
|Controller deleteAllCarts|cartController=>deleteAllCarts|Unit|WB/branch coverage|
|Controller getAllCarts|cartController=>getAllCarts|Unit|WB/branch coverage|
|DAO addToCart|cartDAO=>addToCart|Unit|WB/branch coverage|
|DAO getCart|cartDAO=>getCart|Unit|WB/branch coverage|
|DAO checkoutCart|cartDAO=>checkoutCart|Unit|WB/branch coverage|
|DAO getCustomerCarts|cartDAO=>getCustomerCarts|Unit|WB/branch coverage|
|DAO removeProductFromCart|cartDAO=>removeProductFromCart|Unit|WB/branch coverage|
|DAO clearCart|cartDAO=>clearCart|Unit|WB/branch coverage|
|DAO deleteAllCarts|cartDAO=>deleteAllCarts|Unit|WB/branch coverage|
|DAO getAllCarts|cartDAO=>getAllCarts|Unit|WB/branch coverage|
|GET getCart|cartRoutes=>getCart|Unit|WB/branch coverage|
|POST addToCart|cartRoutes=>addToCart|Unit|WB/branch coverage|
|PATCH checkoutCart|cartRoutes=>checkoutCart|Unit|WB/branch coverage|
|GET getCustomerCarts|cartRoutes=>getCustomerCarts|Unit|WB/branch coverage|
|DELETE removeProductFromCart|cartRoutes=>removeProductFromCart|Unit|WB/branch coverage|
|DELETE clearCart|cartRoutes=>clearCart|Unit|WB/branch coverage|
|DELETE deleteAllCarts|cartRoutes=>deleteAllCarts|Unit|WB/branch coverage|
|GET getAllCarts|cartRoutes=>getAllCarts|Unit|WB/branch coverage|
|Test successful operation|addToCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test emptyProductStockError|addToCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test model does not exist|addToCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|getCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|checkoutCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|No unpaid cart belong to user|checkoutCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Cart contain no product|checkoutCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|getCustomerCarts DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|removeProductFromCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|No unpaid cart belong to user|removeProductFromCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Product does not exist|removeProductFromCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Product not in cart|removeProductFromCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|cleanCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Cart not found|cleanCart DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|deleteAllCarts DAO+Controller|DAO+Controller|BB/ eq partitioning|
|Test successful operation|getAllCarts DAO+Controller|DAO+Controller|BB/ eq partitioning|

# Coverage

## Coverage of FR

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|FR2.1|GET /users/ ; Controller getUsers ; DAO getUsers +fail; API and Controller+DAO integration test|FR2.2|GET /users/role/:role ; Controller getUsersByRole ; DAO getUsersByRole; API and Controller+DAO integration test|
|FR2.3|GET /users/:username ; Controller getUserByUsername + fail; DAO getUserByUsername; API and Controller+DAO integration test|FR2.4|PATCH /users/:username ; Controller updateUserInfo +fail; DAO updateUser; API and Controller+DAO integration test|
|FR2.5|DELETE /users/:username ; Controller deleteUser +auth errors; DAO deleteUser +fail; API and Controller+DAO integration test|FR2.6|DELETE /users/ ; Controller deleteAll ; DAO deleteAll; API and Controller+DAO integration test|
|FR1.1|POST /sessions Route, Controller, DAO unit test, API and Controller+DAO integration test |FR1.2|DELETE /sessions/current Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR1.3|GET /sessions/current Route, Controller, DAO unit test, API and Controller+DAO integration test|FR4.1|POST /reviews/:model  Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR4.2|GET /reviews/:model  Route, Controller, DAO unit test, API and Controller+DAO integration test|FR4.3|DELETE /reviews/:model  Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR4.4|DELETE /reviews/:model/all  Route, Controller, DAO unit test, API and Controller+DAO integration test|FR4.5|DELETE /reviews  Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR3.1|POST/products/ ; Controller registerProduct;DAO registerProducts +fail ;|FR3.2|PATCH /products/:model ; Controller changeProductQuantity ;DAO changeProductQuantity |
|FR3.3|PATCH /products/:model/sell ; Controller sellProduct +fails;|FR3.4|GET /products/ ; Controller getProduct + fail; DAO getAllProducts +fail|
|FR3.4.1|GET /products/available ; Controller getAvailableProduct ;|FR3.5|GET/products/; Controller getProduct ; DAO getProductsByCategory +fail |
|FR3.5.1|GET /products/available ; Controller getAvailableProduct ; |FR3.6|GET/products/ ;Controller getProduct ; DAO getProduct +fail |
|FR3.6.1|GET /products/available ; Controller getAvailableProduct ;|FR3.7|DELETE /product/:model; Controller deleteProduct ; DAO deleteProduct|
|FR3.8|DELETE/products/; Controller deleteAllProduct ; DAO deleteAllProduct|FR5.1|GET /carts Route, Controller, DAO unit test, API and Controller+DAO integration test |
|FR5.2|POST /carts Route, Controller, DAO unit test, API and Controller+DAO integration test|FR5.3|PATCH /carts Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR5.4|GET /carts/history Route, Controller, DAO unit test, API and Controller+DAO integration test|FR5.5|DELETE /carts/products/:model Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR5.6|DELETE /carts/current Route, Controller, DAO unit test, API and Controller+DAO integration test|FR5.7|GET /carts/all Route, Controller, DAO unit test, API and Controller+DAO integration test|
|FR5.8|DELETE /carts Route, Controller, DAO unit test, API and Controller+DAO integration test|

## Coverage white box

![Coverage_all](/assets/images/test_coverage/all_test.png)
![Coverage_unit](/assets/images/test_coverage/unit_test.png)
![Coverage_integration](/assets/images/test_coverage/integration_test.png)