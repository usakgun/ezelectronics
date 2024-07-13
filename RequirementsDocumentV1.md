# Requirements Document - current EZElectronics

Date:

Version: V1 - description of EZElectronics in CURRENT form (as received by teachers)

| Version number | Change |
| :------------: | :----: |
|                |        |

# Contents

- [Requirements Document - current EZElectronics](#requirements-document---current-ezelectronics)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1 SIGN UP](#use-case-1-uc1-sign-up)
      - [Scenario 1.1, sign-up success](#scenario-11-nominal---sign-up-success)
      - [Scenario 1.2, sign-up failed](#scenario-12-exception---sign-up-failed)
    - [Use case 2, UC2 LOG-IN](#use-case-2-uc2-log-in)
      - [Scenario 2.1 Nominal - login success](#scenario-21-nominal---login-success)
      - [Scenario 2.2 Exception - log-in failed](#scenario-22-exception---log-in-failed)
    - [Use case 3, UC3 Buy Product(s)](#use-case-3-uc3-buy-products)
      - [Scenario 3.1 Nominal scenario - Customer logs in, selects products to buy, proceeds with checkout](#scenario-31-nominal-scenario---customer-logs-in-selects-products-to-buy-proceeds-with-checkout)
      - [Scenario 3.2 Variants, cancel order, remove cart](#scenario-32-variants-cancel-order-remove-cart)
      - [Scenario 3.3 Variant, remove product from cart](#scenario-33-variant-remove-product-from-cart)
      - [Scenario 3.4 Exception, Product has already been sold, doesn't exist, already in another cart](#scenario-34-exception-product-has-already-been-sold-doesnt-exist-already-in-another-cart)
    - [Use case 4, UC4 View history of paid cart](#use-case-4-uc4-view-history-of-paid-cart)
      - [Scenario 4.1 Successful operation](#scenario-41-successful-operation)
    - [Use case 5, UC5 Add a Product (For manager)](#use-case-5-uc5-add-a-product-for-manager)
      - [Scenario 5.1 Add product success](#scenario-51-add-product-success)
      - [Scenario 5.2 Exceptions, Product already exists](#scenario-52-exceptions-product-already-exists)
    - [Use case 6, UC6 Delete product](#use-case-6-uc6-delete-product)
      - [Scenario 6.1 Nominal, Successfully remove product](#scenario-61-nominal-successfully-remove-product)
      - [Scenario 6.2 Exception, fail to remove](#scenario-62-exception-fail-to-remove)
    - [Use case 7, UC7 Update product (mark product as sold)](#use-case-7-uc7-update-product-mark-product-as-sold)
      - [Scenario 7.1 Nominal, Successfully update product](#scenario-71-nominal-successfully-update-product)
      - [Scenario 7.2 Exception, Update failed, product does not exist](#scenario-72-exception-update-failed-product-does-not-exist)
    - [Use case 8, UC8 Registers the arrival of a set of products of the same model](#use-case-8-uc8-registers-the-arrival-of-a-set-of-products-of-the-same-model)
      - [Scenario 8.1 Nominal, Successfully Register list of products](#scenario-81-nominal-successfully-register-list-of-products)
    - [Use case 9, UC9 View all product available in the store (for maneger)](#use-case-9-uc9-view-all-product-available-in-the-store-for-maneger)
      - [Scenario 9.1 Nominal, Successfully view available products in store](#scenario-91-nominal-successfully-view-available-products-in-store)
    - [Use case 10, UC10 Delete user](#use-case-10-uc10-delete-user)
      - [Scenario 10.1 Nominal, Successfully remove user](#scenario-101-nominal-successfully-remove-user)
      - [Scenario 10.2 Exception, fail to remove](#scenario-102-exception-fail-to-remove)
    - [Use case 11, UC11 View all users](#use-case-11-uc11-view-all-users)
      - [Scenario 11.1 Nominal, Successfully remove user](#scenario-111-nominal-successfully-remove-user)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZElectronics (read EaSy Electronics) is a software application designed to help managers of electronics stores to manage their products and offer them to customers through a dedicated website. Managers can assess the available products, record new ones, and confirm purchases. Customers can see available products, add them to a cart and see the history of their past purchases.

# Stakeholders

| Stakeholder name | Description |
| :--------------: | :---------: |
| Developer        | Develops the application |        
| Store manager    | Buys software for his store and use it to manage the store |
| Customer         | Uses software to buy products |
| Payment service  | Handle Payment on the app|

# Context Diagram and interfaces

## Context Diagram

![Context Diagram](/assets/images/requirementV1Diagram/ContextDiagram.png)

## Interfaces

|   Actor   | Logical Interface | Physical Interface |
| :-------: | :---------------: | :----------------: |
| Customer  | GUI               | Smartphone, PC     |
| Store manager | GUI           | PC                 |
| Payment service | Internet    |                    |

# Stories and personas

1. Personas 1: Store manager, owner of an electronic store, age between 25 to 60.
    - Story: Need a web application to handle products inside the store and online sales.

2. Personas 2: Customers of the store, age between 18 to 60, have a stable source of income.
    - Story: No electronic store near by, use the web application to buy the electronic device online for convinience.

# Functional and non functional requirements

## Functional Requirements

### FR1 Manage cart.
  * FR1.1 Delete cart for current log-in user.
  * FR1.2 Add/remove products from cart.
  * FR1.3 Checkout cart.
  * FR1.4 View current cart.
  * FR1.5 View history of paid cart.

### FR2 Manage products.
  * FR2.1 Create/delete product.
  * FR2.2 Mark product as sold.
  * FR2.3 View all products.
  * FR2.4 Filter product by category/model/code.
  * FR2.5 Registers the arrival of a set of products of the same model.

### FR3 Manage users.
  * FR3.1 Crate/delete user.
  * FR3.2 View all users.
  * FR3.3 Filter user by roll/username.

### FR4 Authentication
  * FR4.1 Sign up new profile/user.
  * FR4.2 Log in/out existing user.
  * FR4.3 Retrives information about an user

## Non Functional Requirements

### NFR1 Usability. (Refers to GUI)
  * User with previous experience in using web application should be able to use the app in less than 10 minutes of tutorial.

### NFR2 Efficiency. (Refers to the web application)
  * All functions on the app must be completed in <0.1 second (excluding network latency).

### NFR3 Reliability. (Refers to the web application)
  * No more than two defect per year per store.
  * The website should be available to user of a store 90% of the year.

### NFR4 Portability (Refers to the web application)
  * Should be available on Google Chrome, Microsoft Edge, Fire Fox.

### Maintainability. (Refers to the web application)
  * A team of 4 people should be able to add/ modify/ cancel a function of the app in less than 100 hours.
  * A team of 4 people should be able to fix a defect in less than 24 hours.
  * A team of 4 people should be able to deploy the app to a different platform in less than 200 hours.

# Use case diagram and use cases

## Use case diagram

![Context Diagram](/assets/images/requirementV1Diagram/UseCaseDiagram.png)

### Use case 1, UC1 SIGN UP

| Actors Involved  | User                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User has no account |
|  Post condition  | |
| Nominal Scenario |         Sign-up           |
|     Variants     |                  |
|    Exceptions    |       Sign up failed        |

#### Scenario 1.1 Nominal - Sign-up success

|  Scenario 1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User has no account |
| Post condition | User has an account |

| Step  |        User             |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | User fills in name, surname, username, password| |
|   2   | | FR4.1 Create a new user in the DB|
|   3   | |Inform user the operation is successful|

#### Scenario 1.2 Exception - Sign up failed

|  Scenario 1.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User has no account|
| Post condition | User has no account|

| Step  |        User             |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | User fills in name, surname, username, password| |
|   2   | | FR4.1 Create a new user in the DB|
|   3   | |Inform user the operation has failed, ERROR: username already exist|

### Use case 2, UC2 LOG-IN

| Actors Involved  | User                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | User is not log-in|
|  Post condition  | |
| Nominal Scenario | Login success|
|     Variants     |                  |
|    Exceptions    | Log-in fail|

#### Scenario 2.1 Nominal - login success

|  Scenario 2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is not log-in |
| Post condition | User is log-in |

| Step  |        User             |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | User provides username and password| |
|   2   | | FR4.2 Handle user log-in|
|   3   | |Login success, FR4.3 Retrives information about current log-in user|
|   4   | |Show user the UI|

#### Scenario 2.2 Exception - log-in failed

|  Scenario 2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User is not log-in|
| Post condition | User is not log-in|

| Step  |        User             |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | User provide in username and password| |
|   2   | | FR4.2 Handle user log-in|
|   3   | | Log-in fail, ERROR: Incorrect username or password|
|   4   | | Ask user for username and password again|

### Use case 3, UC3 Buy Product(s)

| Actors Involved  | Customer                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Customer is log-in                                                   |
|  Post condition  |                                                                      |
| Nominal Scenario | Select products and add to cart, view cart, pay for the cart         |
|     Variants     | Remove product from cart, Cancel order (remove cart)                 |
|    Exceptions    | Product has already been sold, doesn't exist, already in another cart|

#### Scenario 3.1 Nominal scenario - Customer logs in, selects products to buy, proceeds with checkout

|  Scenario 3.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Ccustomer is log-in                                                        |
| Post condition | Order is placed                                                            |


| Step  |        Customer         |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Add product to cart| |
|   2   | | FR1.2 Add a product to the user cart     |
|   3   | Repeat STEP 1 for every product user wants| |
|   4   | | Repeat step 2 everytime user add a product|
|   5   | View current cart| |
|   6   | | FR1.4 View list of products in the current cart|
|   7   | Check out| |
|   8   | | FR1.3 Check out cart|

#### Scenario 3.2 Variants, cancel order, remove cart

|  Scenario 3.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer is log-in                                                         |
| Post condition | Order is not placed                                                        |

| Step  |        Customer         |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Add product to cart| |
|   2   | | FR1.2 Add a product to the user cart     |
|   2   | Repeat STEP 1 for every product user wants| |
|   3   | | Repeat step 2 everytime user add a product|
|   4   | Reomve cart| |
|   5   | | FR1.1 Delete cart|

#### Scenario 3.3 Variant, remove product from cart

|  Scenario 3.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer is log-in |
| Post condition |  Order is placed   |

| Step  |        Customer         |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Add product to cart| |
|   2   | | FR1.2 Add a product to the user cart     |
|   2   | Repeat STEP 1 for every product user wants| |
|   3   | | Repeat step 2 everytime user add a product|
|   4   | Remove product from cart| |
|   5   | | FR1.2 Remove a product from user cart|
|   6   | Repeat step 4 for every product user want to remove|
|   7   | | Repeat step 5 everytime user remove a product|
|   8   | Check out| |
|   9   | | FR1.3 Check out cart|

#### Scenario 3.4 Exception, Product has already been sold, doesn't exist, already in another cart

|  Scenario 3.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer is log-in |
| Post condition | Order is placed |

| Step  |        Customer         |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Add product to cart| |
|   2   | | FR1.2 Add a product to the user cart |
|   3   | | Error: Product has already been sold, doesn't exist or already in another cart|
|   4   | Choose another product to add to cart| |
|   5   | | FR1.2 Add a product to the user cart|
|   6   | Check out| |
|   7   | | FR1.3 Check out cart|

### Use case 4, UC4 View history of paid cart

| Actors Involved  | Customer                                                             |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Customer is log-in                                                   |
|  Post condition  | Show history of paid cart by user                                    |
| Nominal Scenario | Successful operation                                                 |
|     Variants     |                                                                      |
|    Exceptions    |                                                                      |

#### Scenario 4.1 Successful operation

|  Scenario 4.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer is log-in                                                         |
| Post condition | History of paid cart by user is shown                                      |


| Step  |        Customer         |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Check out paid cart history| |
|   2   | | FR1.5 View history of paid cart     |

### Use case 5, UC5 Add a Product (For manager)

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is logged-in |
|  Post condition  | |
| Nominal Scenario |         Add product table in DB            |
|     Variants     |                  |
|    Exceptions    |       Product already exists         |

#### Scenario 5.1 Add product success

|  Scenario 5.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Manager is logged-in |
| Post condition |  DB updated   |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Insert a new product | |
|   2   | | FR2.1 Add a new product to the DB |
|   3   | |Inform manager the operation is successful|

#### Scenario 5.2 Exceptions, Product already exists

|  Scenario 5.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Manager is logged-in |
| Post condition |  DB not updated   |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Insert a new product| |
|   2   | | FR2.1 Add a new product to the DB |
|   3   | |Inform manager the operation has failed, ERROR: Product already exists|

### Use case 6, UC6 Delete product

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in |
|  Post condition  | |
| Nominal Scenario | Successful removal of product |
|     Variants     |                  |
|    Exceptions    | Product does not exist |

#### Scenario 6.1 Nominal, Successfully remove product

|  Scenario 6.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product exist |
| Post condition | Product is removed |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for product to be remove| |
|   2   | | FR2.4 Retrive product by code|
|   3   | Manager remove product| |
|   4   | | FR2.1 Remove product from DB|

#### Scenario 6.2 Exception, fail to remove

|  Scenario 6.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product does not exist|
| Post condition | |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for product(s) to be removed| |
|   2   | | FR2.4 Retrive product by code|
|   3   | | Inform manager no product exist with the above code|

### Use case 7, UC7 Update product (mark product as sold)

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in |
|  Post condition  | |
| Nominal Scenario | Successful update of product |
|     Variants     |                  |
|    Exceptions    | Product does not exist |

#### Scenario 7.1 Nominal, Successfully update product

|  Scenario 7.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product exist |
| Post condition | Product is updated |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for product to be updated| |
|   2   | | FR2.4 Retrive product by code|
|   3   | Manager updated product| |
|   4   | | FR2.2 Mark product as sold|

#### Scenario 7.2 Exception, Update failed, product does not exist

|  Scenario 7.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product does not exist|
| Post condition | |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for product to be remove| |
|   2   | | FR2.4 Retrive product by code|
|   3   | | Inform manager no product exist with the above code|

### Use case 8, UC8 Registers the arrival of a set of products of the same model

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in|
|  Post condition  | |
| Nominal Scenario | Successfully Register list of products |
|     Variants     | |
|    Exceptions    | |

#### Scenario 8.1 Nominal, Successfully Register list of products

|  Scenario 8.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product(S) does not exist |
| Post condition | Product(s) exist |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager want to Register a set of products that has just arrvied | |
|   2   | | FR2.5 Registers the arrival of a set of products of the same model|
|   3   | | Successful operation|

### Use case 9, UC9 View all product available in the store (for maneger)

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in |
|  Post condition  | |
| Nominal Scenario | Successfully view avavilable product in the store |
|     Variants     | |
|    Exceptions    | |

#### Scenario 9.1 Nominal, Successfully view available products in store

|  Scenario 9.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Product(S) does not exist |
| Post condition | Product(s) exist |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager want to view available products in store| |
|   2   | | FR2.3 View all products|
|   3   | | Successful operation|

### Use case 10, UC10 Delete user

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in |
|  Post condition  | |
| Nominal Scenario | Successful removal of user |
|     Variants     |                  |
|    Exceptions    | User does not exist |

#### Scenario 10.1 Nominal, Successfully remove user

|  Scenario 10.1 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User exist |
| Post condition | User is removed |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for user to be remove| |
|   2   | | FR3.3 Retrive user by user name|
|   3   | Manager remove user| |
|   4   | | FR3.1 Remove user from DB|

#### Scenario 10.2 Exception, fail to remove

|  Scenario 10.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | User does not exist|
| Post condition | |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager search for user to be removed| |
|   2   | | FR3.3 Retrive user by username|
|   3   | | Inform manager no user exist with the above username|

### Use case 11, UC11 View all users

| Actors Involved  | Manager                                                              |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | Manager is log-in |
|  Post condition  | List of all user is shown|
| Nominal Scenario | Successfully view all users |
|     Variants     | |
|    Exceptions    | |

#### Scenario 11.1 Nominal, Successfully remove user

|  Scenario 11.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Manager is log-in |
| Post condition | List of all user is shown |

| Step  |        Manager          |            System             |
| :---: | :---------------------: | :----------------------------:|
|   1   | Manager want to view list of all users in the DB| |
|   2   | | FR3.2 View all users|
|   3   | | Successful operation|

# Glossary

![Context Diagram](/assets/images/requirementV1Diagram/Glossary.png)

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram
![Context Diagram](/assets/images/requirementV1Diagram/DeploymentDiagram.png)
