/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
var NS = "org.prototype.blockchainhalal";
/**
 * Write your transction processor functions here
 */

/**
 * This is just a function that will setup a new participant and asset for demo purpose only. not for real application business logic
 * @param {org.prototype.blockchainhalal.Init} Init
 * @transaction
 */

async function Init(Init) {
  var Factory = getFactory();
}

/**
 *
 * Description :
 * This function is used to generate product ID based on productTypes.
 * Access Level : Same as CreateProduct that calls this function
 */
async function GenerateProductID(ProductTypes, id) {
  var typeId = "PRD";
  if (ProductTypes == "Animal Product") {
    typeId = "DRY";
  } else if (ProductTypes == "Vegetables") {
    typeId = "VGT";
  } else if (ProductTypes == "Fruits") {
    typeId = "FRT";
  } else if (ProductTypes == "Meats") {
    typeId = "MTS";
  } else if (ProductTypes == "Grains") {
    typeId = "GRN";
  } else if (ProductTypes == "Beverages") {
    typeId = "BVG";
  } else if (ProductTypes == "Dishes") {
    typeId = "DSH";
  } else if (ProductTypes == "PackagedProduct") {
    typeId = "PCK";
  } else if (ProductTypes == "Medicine") {
    typeId = "MDC";
  }
  return typeId + "-" + id;
}
/**
 *  Function CreateRawProduct
 *  Description :
 *  Function to Create a New Raw Product
 *
 *  Access Level :
 *  Can only be executed by peer type supplier or class rawmaterial company
 *  @param {org.prototype.blockchainhalal.CreateRawProduct} rawProductData
 *  @transaction
 */
async function CreateRawProduct(rawProductData) {
  var factory = getFactory();

  // Generate the product ID
  var ProductID = GenerateProductID(
    rawProductData.ProductTypes,
    rawProductData.ProductID
  );
  // Create the rawproduct with it's properties
  var rawproduct = factory.newResource(
    NS,
    "RawProduct",
    rawProductData.ProductID
  );
  rawproduct.CurrentOwner = getCurrentParticipant();
  rawproduct.productDesc = rawProductData.productDesc;
  rawproduct.productStatus = rawProductData.productStatus;
  rawproduct.productionDate = rawProductData.productionDate;
  rawproduct.expirationDate = rawProductData.expirationDate;
  rawproduct.productTypes = rawProductData.productTypes;
  rawproduct.CertificateLink = rawproductData.CertificateLink;

  //Create new history by using factory.newConcept() function in common API
  var newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
  newhistory.owner = getCurrentParticipant();
  newhistory.time = CreateRawProduct.timestamp;
  newhistory.desc = " Raw Product Created ";

  //push the record to the array of product historical record
  if (rawproduct.productHistory) {
    rawproduct.productHistory.push(newhistory);
  } else {
    rawproduct.productHistory = [newhistory];
  }

  //Persist the state in hyperledger
  return getParticipantRegistry(NS + ".RawProduct").then(function(
    rawProductRegistry
  ) {
    return rawProductRegistry.addAll([rawproduct]);
  });
}

/**
 *  Function Create CreateProcProduct
 *  Description :
 *  Function to Create a New Processed Product
 *
 *  Access Level :
 *  Can only be executed by peer type manufacturer or class manufacturing company
 *  @param {org.prototype.blockchainhalal.CreateProcProduct} productData
 *  @transaction
 */
async function createProcProduct(productData) {
  var factory = getFactory();

  // Generate the product ID
  var ProductID = GenerateProductID(
    rawProductData.ProductTypes,
    rawProductData.ProductID
  );
  // Create the procproduct with it's properties
  var newproduct = factory.newResource(
    NS,
    "ProcProduct",
    ProductData.ProductID
  );
  newproduct.CurrentOwner = getCurrentParticipant();
  newproduct.productDesc = productData.productDesc;
  newproduct.productStatus = productData.productStatus;
  newproduct.productionDate = productData.productionDate; //Actual product production datetime
  newproduct.expirationDate = productData.expirationDate;
  newproduct.productTypes = productData.productTypes;
  newproduct.CertificateLink = productData.CertificateLink;
  newproduct.composition = productData.composition;

  //Create new history by using factory.newConcept() function in common API
  var newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
  newhistory.owner = getCurrentParticipant();
  newhistory.time = CreateProcProduct.timestamp; // the datetime product created in the system
  newhistory.desc = " Processed Product Created ";

  //push the record to the array of product historical record
  if (newproduct.productHistory) {
    newproduct.productHistory.push(newhistory);
  } else {
    newproduct.productHistory = [newhistory];
  }

  // Persist the state in hyperledger
  return getParticipantRegistry(NS + ".ProcProduct").then(function(
    procProductRegistry
  ) {
    return procProductRegistry.addAll([newproduct]);
  });
}

/**
 *  Function PackProduct
 *  Description :
 *  Creating a package that contains multiple product, making it easier to transfer huge number of product
 *
 *  Access Level : anyone that owns a product
 *
 *  @param {org.prototype.blockchainhalal.CreatePackage} packageData
 *  @transaction
 */
async function createPackage(packageData) {
  var factory = getFactory();

  //Generate the ID

  //Create the package with it's complete properties
  var newpackage = factory.newResource(NS, "Package", packageData.ID);
  newpackage.packageName = packageData.packageName;
  newpackage.packageOwner = packageData.packageOwner;
  newpackage.productList = packageData.productList;

  // Record the historical change of product
  //Create new history by using factory.newConcept() function in common API
  var newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
  newhistory.owner = getCurrentParticipant();
  newhistory.time = CreatePackage.timestamp; // the datetime product created in the system
  newhistory.desc = "Product Packaged";

  // Using the already created concept, assign it to all product under the package. Iteration using for loop.
  for (i = 0; i < newpackage.productList.length(); i++) {
    if (newpackage.productList[i].productHistory) {
      newpackage.productList[i].productHistory.push(newhistory);
    } else {
      newpackage.productList[i].productHistory = [newhistory];
    }
  }

  //Persist the state in blockchain
  return getParticipantRegistry(NS + ".Package").then(function(
    packageRegistry
  ) {
    return packageRegistry.addAll([newpackage]);
  });
}

//================================================================================================================================================
//=============================================      THIS MARKS THE CODE YOU DEVELOPED FIRMLY       ==============================================
//================================================================================================================================================

/**
 *  Function to Send a packaged product from one company to another
 *  Can be executed by everyone that have the ownership of the product
 *  @param {org.prototype.blockchainhalal.SendPackage} SendPackage
 *  @transaction
 */
async function sendPackage(sendPackage) {
  // make the variable easier to read
  var shipment = sendPackage;
  var pack = shipment.shippedPackage;

  // Validates ownership of the product
  if (pack.owner == getCurrentParticipant()) {
    // set the new owner of the package
    pack.owner = shipment.newOwner;
    //iteration for all products inside a package
    for (i < 0; i < pack.productPackaged.Lentgh(); i++) {
      // set the new owner of each of the product in the package
      pack.productPackaged[i].owner == pack.owner;
      // writing to product history atribute
      // pack.productPackaged[i].productHistory.(pack.productPackaged[i].productHistory.length())

      // set the status of the product
      pack.productPackaged[i].productStatus == "IN_TRANSIT";

      // persist the state in blockchain network for each product
    }
  } else {
    throw error("you do not own this package!");
  }
}

/**
 *  Function ReturnPackage
 *
 * Description :
 *  This function only can be called by function receive product, with the condition the receiver choose to reject the product
 *  Product can be rejected if it's not in good condition
 *
 *  Access Level :
 *
 *  @param {org.prototype.blockchainhalal.ReturnPackage} returnedPackage
 *  @transaction
 */
async function returnPackage(returnedPackage) {}

/**
 *  Function ReceivePackage
 *
 * Description :
 *  This function only can be called by function receive product, with the condition the receiver choose to reject the product
 *  Product can be rejected if it's not in good condition
 *
 *  Access Level :
 *
 *  @param {org.prototype.blockchainhalal.ReceivePackage} receivedProduct
 *  @transaction
 */
async function receivePackage(receivedProduct) {
  // Validates ownership of the product
  // check IN_TRANSIT Product
  // ChangeStatus to Received
}

/** UNUSED FUNCTION
 * FUNCTION RECORD PRODUCT HISTORY
 * DESC :
 * Function to add record to the atributes productHistory in object product. make the process of tracking
 * ownership is easier since the data is available in the product
 * ACCESS LEVEL : anyone with ownership to the product
 * @param {org.example.trading.RecordProductHistory} recordProductHistory - the trade to be processed
 * @transaction
 */
//this function might not needed after all --> masukin di each process
async function recordProductHistory(recordProductHistory) {
  // belum ditambahin new concept, or gausah ?
  var product = recordProductHistory.product;
  var history = recordProductHistory.history;
  if (product.productHistory) {
    product.productHistory.push(history);
  } else {
    product.productHistory = [history];
  }
  // check whether the product is raw or processed
  if (product.getType() == "RawProduct") {
    return getAssetRegistry(NS + ".RawProduct").then(function(
      rawProductRegistry
    ) {
      return rawProductRegistry.update(product);
    });
  } else if (product.getType() == "ProcProduct") {
    return getAssetRegistry(NS + ".ProcProduct").then(function(
      procProductRegistry
    ) {
      return procProductRegistry.update(product);
    });
  }
}
/**
 * Track the trade of a commodity from one trader to another
 * @param {org.example.trading.Trade} trade - the trade to be processed
 * @transaction
 */

/** sample trade function
 * 
 async function tradeCommodity(trade) {
  // eslint-disable-line no-unused-vars

  // set the new owner of the commodity
  trade.commodity.owner = trade.newOwner;
  const assetRegistry = await getAssetRegistry("org.example.trading.Commodity");

  // emit a notification that a trade has occurred
  const tradeNotification = getFactory().newEvent(
    "org.example.trading",
    "TradeNotification"
  );
  tradeNotification.commodity = trade.commodity;
  emit(tradeNotification);

  // persist the state of the commodity
  await assetRegistry.update(trade.commodity);
}
 */
