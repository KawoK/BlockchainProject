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
 *  Function CreateRawProduct
 *  Description :
 *  Function to Create a New Raw Product
 *
 *  Access Level :
 *  Can only be executed by participant with class rawmaterial company
 *  @param {org.prototype.blockchainhalal.CreateRawProduct} rawProductData
 *  @transaction
 */

async function createRawProduct(rawProductData) {
  // get the required registry
  return await getAssetRegistry(NS + ".RawProduct").then(function(
    rawProductRegistry
  ) {
    console.log("process started");
    let factory = getFactory();

    // Create the rawproduct with it's properties
    // Create new resources
    let rawproduct = factory.newResource(
      NS,
      "RawProduct",
      rawProductData.productID
    );
    // Create Relationship
    currentparticipant = factory.newRelationship(
      NS,
      "SupplyCompany",
      getCurrentParticipant().CompanyEmail
    );
    // fill the rest data
    rawproduct.CurrentOwner = currentparticipant;
    rawproduct.productName = rawProductData.productName;
    rawproduct.productDesc = rawProductData.productDesc;
    rawproduct.productStatus = "Created";
    rawproduct.productionDate = rawProductData.productionDate;
    rawproduct.expirationDate = rawProductData.expirationDate;
    rawproduct.productTypes = rawProductData.productTypes;
    rawproduct.certificateLink = rawProductData.certificateLink;
    rawproduct.measuringUnit = rawProductData.measuringUnit;
    rawproduct.unitCount = rawProductData.unitCount;
    rawproduct.productionLocation = rawProductData.productionLocation;
    console.log("instantiation success");

    //Create new history by using factory.newConcept() function in common API
    let newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
    newhistory.owner = getCurrentParticipant();
    newhistory.timestamp = rawProductData.timestamp;
    newhistory.desc = rawproduct.productName + " Created";
    console.log("createconcept success");
    rawproduct.productHistory = [newhistory];

    //this update the registry to persist data of rawproduct in blockchain
    return rawProductRegistry.add(rawproduct);
  });
  //log in the system
  console.log("rawproductadded");
}

/**
 *  Function CreatePackage
 *  Description :
 *  Creating a package that contains multiple product, making it easier to transfer huge number of product
 *
 *  Access Level : anyone that owns a product
 *
 *  @param {org.prototype.blockchainhalal.CreatePackage} packageData
 *  @transaction
 */
async function createPackage(packageData) {
  // Get the required Registry
  let PackageRegistry = await getAssetRegistry(NS + ".Package");
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  let factory = getFactory();

  //Create the package with it's complete properties
  let newpackage = factory.newResource(NS, "Package", packageData.packageID);

  // resolve relationship of participant company type
  if (getCurrentParticipant().getType() == "SupplyCompany") {
    currentparticipant = factory.newRelationship(
      NS,
      "SupplyCompany",
      getCurrentParticipant().CompanyEmail
    );
  } else if (getCurrentParticipant().getType() == "ManufacturingCompany") {
    currentparticipant = factory.newRelationship(
      NS,
      "ManufacturingCompany",
      getCurrentParticipant().CompanyEmail
    );
  } else if (getCurrentParticipant().getType() == "DistributionCompany") {
    currentparticipant = factory.newRelationship(
      NS,
      "DistributionCompany",
      getCurrentParticipant().CompanyEmail
    );
  } else if (getCurrentParticipant().getType() == "RetailCompany") {
    currentparticipant = factory.newRelationship(
      NS,
      "RetailCompany",
      getCurrentParticipant().CompanyEmail
    );
  } else {
    throw new Error(
      "You are either an admin or regulator. Only companies can create a package"
    );
  }
  // fill out the rest of the attribute
  newpackage.packageOwner = currentparticipant;
  newpackage.packageStatus = "Created";
  newpackage.packageName = packageData.packageName;

  // resolving relationship for each of the product in productlist
  let listproduct = []; // this stores the relationshi
  let productArray = []; // this stores the actual product data
  for (i = 0; i < packageData.productList.length; i++) {
    productArray[i] = packageData.productList[i];
    if (
      productArray[i].productStatus == "Created" ||
      productArray[i].productStatus == "Owned"
    ) {
      if (productArray[i].getType() == "RawProduct") {
        listproduct[i] = factory.newRelationship(
          NS,
          "RawProduct",
          packageData.productList[i].getIdentifier()
        );
      } else if (productArray[i].getType() == "ProcProduct") {
        listproduct[i] = factory.newRelationship(
          NS,
          "ProcProduct",
          packageData.productList[i].getIdentifier()
        );
      }
    } else {
      throw new Error("Product can't be packaged!");
    }
  }
  // add the resolved relationship to new package attribute
  newpackage.productList = listproduct;
  // add the package to the ledger
  await PackageRegistry.add(newpackage);

  // Create new history for each product
  let newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
  newhistory.owner = currentparticipant;
  newhistory.timestamp = packageData.timestamp; // the datetime product created in the system
  newhistory.desc = " has been Packaged at : " + String(packageData.timestamp);

  // Using the already created concept, assign the concept to all product under the package. Iteration using for loop.
  for (i = 0; i < packageData.productList.length; i++) {
    newhistory.desc = productArray[i].productName + newhistory.desc;
    if (productArray[i].productHistory) {
      productArray[i].productHistory.push(newhistory);
    } else {
      productArray[i].productHistory = [newhistory];
    }
    packageData.productList[i].productStatus = "Packaged";
    newhistory.desc =
      " has been Packaged at : " + String(packageData.timestamp);

    // Update each of the blockchain data
    if (productArray[i].getType() == "RawProduct") {
      await RawProductsRegistry.update(productArray[i]);
    } else if (productArray[i].getType() == "ProcProduct") {
      await ProcProductsRegistry.update(productArray[i]);
    }
  }
}

/**
 *  Function to Send a packaged product from one company to another
 *  Can be executed by everyone that have the ownership of the product
 *  @param {org.prototype.blockchainhalal.SendPackage} sendPackage
 *  @transaction
 */
async function sendPackage(sendPackage) {
  // get required registries
  let PackageRegistry = await getAssetRegistry(NS + ".Package");
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  // instantiate factory

  let factory = getFactory();
  var shipment = sendPackage;
  var pack = sendPackage.shippedPackage;

  // Validates ownership of the product & the status of the package
  // Can only send the product if the package is owned and either created, received, or owned (the product that already in transfer can't be transferred again)
  // packageStatus = Created --> initial packaging
  // packgaeStatus = Owned --> after one or more package transfer and the product is packaged in different pack
  // packageStatus = Received --> directly resending the package without unpacking
  if (
    pack.packageOwner.getIdentifier() ==
      getCurrentParticipant().getIdentifier() &&
    (pack.packageStatus == "Created" || pack.packageStatus == "Received")
  ) {
    // set the new owner of the package
    pack.packageOwner = shipment.newOwner;
    pack.packageStatus = "Sent";

    //Create product history record concept
    var sendingHistory = factory.newConcept(NS, "ProductOwnershipHistory");
    sendingHistory.owner = getCurrentParticipant();
    sendingHistory.timestamp = sendPackage.timestamp;
    sendingHistory.desc =
      "This product is being sent to " +
      pack.packageOwner.CompanyEmail +
      " in package " +
      pack.packageID +
      ": " +
      pack.packageName +
      " with message : " +
      shipment.shipmentMessage;

    //iteration for all products inside a package
    for (i = 0; i < pack.productList.length; i++) {
      // set the new owner of each of the product in the package
      pack.productList[i].CurrentOwner = shipment.newOwner;

      // set the status of the product
      pack.productList[i].productStatus = "In_Transit";

      // update the history of product to being sent
      if (pack.productList[i].productHistory) {
        pack.productList[i].productHistory.push(sendingHistory);
      } else {
        pack.productList[i].productHistory = [sendingHistory];
      }
      // persist the state in blockchain for each product
      if (pack.productList[i].getType() == "RawProduct") {
        await RawProductsRegistry.update(pack.productList[i]);
      } else if (pack.productList[i].getType() == "ProcProduct") {
        await ProcProductsRegistry.update(pack.productList[i]);
      } else {
        throw new Error("product type can't be identified");
      }
    }

    // persist the state in hyperledger network for the shipment
    await PackageRegistry.update(sendPackage.shippedPackage);
  } else {
    // this is the condition where package owner is not the one invoke sendpackage transaction
    // or the package already send so there will be no duplicate transaction
    throw new Error(
      "You can't send package that u don't own or package that is already being sent"
    );
  }
}

/**
 *  Function ReceivePackage
 *
 * Description :
 *  This function is to set ownership status of the product that being sent to another company to be received and owned
 *	so it can be processed or sold or repackaged (if it's still in transit, any transaction can't be done with the product)
 *
 *  Access Level :
 *
 *  @param {org.prototype.blockchainhalal.ReceivePackage} receivedProduct
 *  @transaction
 */
async function receivePackage(receivedProduct) {
  // Get the required registry
  let PackageRegistry = await getAssetRegistry(NS + ".Package");
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  let factory = getFactory();

  var pack = receivedProduct.shippedPackage;

  //Validates ownership of the package
  if (
    pack.packageOwner.getIdentifier() ==
      getCurrentParticipant().getIdentifier() &&
    pack.packageStatus == "Sent"
  ) {
    // Change package status to received
    pack.packageStatus = "Received";
    // Create Concept for new history record
    var receiveHistory = factory.newConcept(NS, "ProductOwnershipHistory");
    receiveHistory.owner = getCurrentParticipant();
    receiveHistory.timestamp = receivedProduct.timestamp;
    receiveHistory.desc =
      "product received by" + getCurrentParticipant().CompanyEmail;

    //iterate for all product under the package
    for (i = 0; i < pack.productList.length; i++) {
      // change the product status from in_transit to received to mark the new owner.
      pack.productList[i].productStatus = "Received";

      // update the history of product to being sent
      if (pack.productList[i].productHistory) {
        pack.productList[i].productHistory.push(receiveHistory);
      } else {
        pack.productList[i].productHistory = [receiveHistory];
      }

      // Persist the state in hyperledger for each product
      if (pack.productList[i].getType() == "RawProduct") {
        await RawProductsRegistry.update(pack.productList[i]);
      } else if (pack.productList[i].getType() == "ProcProduct") {
        await ProcProductsRegistry.update(pack.productList[i]);
      }
    }

    await PackageRegistry.update(pack);
  } else {
    throw new Error(
      "You do not own this package or the package is not yet sent by the sender to you"
    );
  }
}

/**
 *  Function ReceivePackage
 *
 * Description :
 *  This function is to set ownership status of the product that being sent to another company to be received and owned
 *	so it can be processed or sold or repackaged (if it's still in transit, any transaction can't be done with the product)
 *
 *  Access Level :
 *
 *  @param {org.prototype.blockchainhalal.UnpackPackage} unpack
 *  @transaction
 */
async function unpack(unpack) {
  // Get the required registry
  let PackageRegistry = await getAssetRegistry(NS + ".Package");
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  let factory = getFactory();

  var pack = unpack.shippedPackage;

  //Validates ownership of the package
  if (
    pack.packageOwner.getIdentifier() ==
      getCurrentParticipant().getIdentifier() &&
    (pack.packageStatus == "Received" || pack.packageStatus == "Created")
  ) {
    // Change package status to received
    pack.packageStatus == "Unpacked";

    // ADDING HISTORY
    var unpackHistory = factory.newConcept(NS, "ProductOwnershipHistory");
    unpackHistory.owner = getCurrentParticipant();
    unpackHistory.timestamp = unpack.timestamp;
    unpackHistory.desc = "product is unpacked at " + String(unpack.timestamp);

    //iterate for all product under the package
    for (i = 0; i < pack.productList.length; i++) {
      // change the product status from in_transit to received to mark the new owner.
      pack.productList[i].productStatus = "Owned";

      // update the history of product to being sent
      if (pack.productList[i].productHistory) {
        pack.productList[i].productHistory.push(unpackHistory);
      } else {
        pack.productList[i].productHistory = [unpackHistory];
      }

      // Persist the state in hyperledger for each product
      if (pack.productList[i].getType() == "RawProduct") {
        await RawProductsRegistry.update(pack.productList[i]);
      } else if (pack.productList[i].getType() == "ProcProduct") {
        await ProcProductsRegistry.update(pack.productList[i]);
      }
    }
    // unbind all the product from the package
    pack.productList = [];

    await PackageRegistry.remove(pack);
  } else {
    throw new Error(
      "You do not own this package or the package is not yet received"
    );
  }
}
/**
 *
 * @param {org.prototype.blockchainhalal.SellProduct} sellProduct
 * @transaction
 */
async function sellProduct(sellProduct) {
  // get Required registry
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  let factory = getFactory();
  var soldproduct = sellProduct.productSold;

  // validates the ownership of the product
  if (
    soldproduct.CurrentOwner.getIdentifier() ==
      getCurrentParticipant().getIdentifier() &&
    soldproduct.productStatus == "Owned"
  ) {
    // set the status of the product to "Sold"
    soldproduct.productStatus = "Sold";
    // create the concept to add product history
    var soldhistory = factory.newConcept(NS, "ProductOwnershipHistory");
    soldhistory.owner = getCurrentParticipant();
    soldhistory.timestamp = sellProduct.timestamp;
    soldhistory.desc =
      soldproduct.productName +
      " is already sold by " +
      getCurrentParticipant().CompanyName +
      " at " +
      String(soldhistory.timestamp);

    // update the history of product to being sent
    if (soldproduct.productHistory) {
      soldproduct.productHistory.push(soldhistory);
    } else {
      soldproduct.productHistory = [soldhistory];
    }

    // persist the state in the ledger
    if (soldproduct.getType() == "RawProduct") {
      await RawProductsRegistry.update(soldproduct);
    } else if (soldproduct.getType() == "ProcProduct") {
      await ProcProductsRegistry.update(soldproduct);
    }
  } else {
    throw new Error(
      "This is either not your product, u have not accept the package, or the package is not yet unpacked"
    );
  }
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
  // Get the required registry
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");
  // Instantiate Factory
  let factory = getFactory();
  // Create the procproduct with it's properties
  let newproduct = factory.newResource(
    NS,
    "ProcProduct",
    productData.productID
  );
  currentparticipant = factory.newRelationship(
    NS,
    "ManufacturingCompany",
    getCurrentParticipant().CompanyEmail
  );
  newproduct.CurrentOwner = currentparticipant;
  newproduct.productName = productData.productName;
  newproduct.productDesc = productData.productDesc;
  newproduct.productStatus = productData.productStatus;
  newproduct.productionDate = productData.productionDate; //Actual product production datetime
  newproduct.expirationDate = productData.expirationDate;
  newproduct.measuringUnit = productData.measuringUnit;
  newproduct.unitCount = productData.unitCount;
  newproduct.productTypes = productData.productTypes;
  newproduct.certificateLink = productData.certificateLink;
  newproduct.productionLocation = productData.productionLocation;
  newproduct.composition = [];

  // new relation for composition
  // resolving relationship for each of the product in productlist
  let listproduct = []; // this stores the relationshi
  let productArray = []; // this stores the actual product data
  for (i = 0; i < productData.composition.length; i++) {
    productArray[i] = productData.composition[i];
    if (
      productArray[i].CurrentOwner.getIdentifier() !=
      newproduct.CurrentOwner.getIdentifier()
    ) {
      throw new Error("You do not own" + productArray[i].productName);
    }
    if (productArray[i].getType() == "RawProduct") {
      listproduct[i] = factory.newRelationship(
        NS,
        "RawProduct",
        productData.composition[i].getIdentifier()
      );
    } else if (productArray[i].getType() == "ProcProduct") {
      listproduct[i] = factory.newRelationship(
        NS,
        "ProcProduct",
        productData.composition[i].getIdentifier()
      );
    }
  }
  newproduct.composition = listproduct;
  //Create new history by using factory.newConcept() function in common API
  var newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
  newhistory.owner = currentparticipant;
  newhistory.timestamp = productData.timestamp;
  newhistory.desc = newproduct.productName + " Created ";

  //push the record to the array of product historical record
  if (newproduct.productHistory) {
    newproduct.productHistory.push(newhistory);
  } else {
    newproduct.productHistory = [newhistory];
  }
  // Persist the state of the newly created proc product in the hyperledger
  await ProcProductsRegistry.add(newproduct);

  // Create concept product historical record for raw material product to be processed
  let prochistorical = factory.newConcept(NS, "ProductOwnershipHistory");
  prochistorical.owner = currentparticipant;
  prochistorical.timestamp = productData.timestamp;
  prochistorical.desc =
    "Product has been processed to create " + newproduct.productName;

  //insert the concept to all product composition to mark it's end of lifecycle --> dont' forget to look at these
  for (i = 0; i < productData.composition.length; i++) {
    // Change the status of the product in the composition
    productArray[i].productStatus = "Processed";
    //push the record to the array of product historical record
    if (productArray[i].productHistory) {
      productArray[i].productHistory.push(prochistorical);
    } else {
      productArray[i].productHistory = [prochistorical];
    }

    //Persist the state in hyperledger for both product
    if (productArray[i].getType() == "RawProduct") {
      await RawProductsRegistry.update(productArray[i]);
    } else if (productArray[i].getType() == "ProcProduct") {
      await ProcProductsRegistry.update(productArray[i]);
    }
  }
}

/**
 *  Function BreakProduct
 *
 * Description : Memecah satu produk menjadi 2 produk
 *
 *  Access Level :
 *
 *  @param {org.prototype.blockchainhalal.BreakProduct} breakProduct
 *  @transaction
 */
async function breakProduct(breakProduct) {
  // get product registries & factory
  let RawProductsRegistry = await getAssetRegistry(NS + ".RawProduct");
  let ProcProductsRegistry = await getAssetRegistry(NS + ".ProcProduct");

  // Deklarasi variabel untuk produk baru dan lama
  var oldproduct = breakProduct.breakedProduct;
  var newUnitCount = breakProduct.dispatchedUnitCount;

  // instansiasi factory
  var factory = getFactory();
  // check the current participant
  if (
    oldproduct.CurrentOwner.getIdentifier() ==
    getCurrentParticipant().getIdentifier()
  ) {
    // check the type of the product
    if (oldproduct.getType() == "RawProduct") {
      var newproduct = factory.newResource(
        NS,
        "RawProduct",
        breakProduct.newProductID
      );
      newproduct.CurrentOwner = oldproduct.CurrentOwner;
      newproduct.productName = oldproduct.productName;
      newproduct.productDesc = oldproduct.productDesc;
      newproduct.productionDate = oldproduct.productionDate;
      newproduct.expirationDate = oldproduct.expirationDate;
      newproduct.productTypes = oldproduct.productTypes;
      newproduct.certificateLink = oldproduct.certificateLink;
      newproduct.measuringUnit = oldproduct.measuringUnit;
      newproduct.productionLocation = oldproduct.productionLocation;
      newproduct.productStatus = oldproduct.productStatus;
    } else if (oldproduct.getType() == "ProcProduct") {
      var newproduct = factory.newResource(
        NS,
        "ProcProduct",
        breakProduct.newProductID
      );
      newproduct.CurrentOwner = oldproduct.CurrentOwner;
      newproduct.productName = oldproduct.productName;
      newproduct.productDesc = oldproduct.productDesc;
      newproduct.productionDate = oldproduct.productionDate;
      newproduct.expirationDate = oldproduct.expirationDate;
      newproduct.productTypes = oldproduct.productTypes;
      newproduct.certificateLink = oldproduct.certificateLink;
      newproduct.measuringUnit = oldproduct.measuringUnit;
      newproduct.productionLocation = oldproduct.productionLocation;
      newproduct.productStatus = oldproduct.productStatus;
      newproduct.composition = oldproduct.composition;

      // create function that caters product composition creation
    } else {
      throw new Error("Product Can't be identified");
    }
    // check the unitcount before processed
    if (oldproduct.unitCount <= newUnitCount) {
      throw new Error(
        "You are adding unitCount to the new product or not breaking it at all"
      );
    }
    // Adjusting the unitCount
    newproduct.unitCount = newUnitCount;
    oldproduct.unitCount = oldproduct.unitCount - newproduct.unitCount;

    // product history for old product
    let oldhistory = factory.newConcept(NS, "ProductOwnershipHistory");
    oldhistory.owner = getCurrentParticipant();
    oldhistory.timestamp = breakProduct.timestamp;
    oldhistory.desc =
      oldproduct.productName +
      " is taken " +
      String(newproduct.unitCount) +
      newproduct.measuringUnit +
      " to create " +
      newproduct.productName;

    // product history for new product
    let newhistory = factory.newConcept(NS, "ProductOwnershipHistory");
    newhistory.owner = getCurrentParticipant();
    newhistory.timestamp = breakProduct.timestamp;
    newhistory.desc =
      "Created From: " +
      oldproduct.productName +
      ", with product ID: " +
      oldproduct.productID +
      ", and details :" +
      breakProduct.dispatchMessage;
    // push the history
    if (oldproduct.productHistory) {
      oldproduct.productHistory.push(oldhistory);
    } else {
      oldproduct.productHistory = [oldhistory];
    }
    if (newproduct.productHistory) {
      newproduct.productHistory.push(newhistory);
    } else {
      newproduct.productHistory = [newhistory];
    }

    //Persist the state in hyperledger for both product
    if (oldproduct.getType() == "RawProduct") {
      await RawProductsRegistry.update(oldproduct);
      await RawProductsRegistry.add(newproduct);
    } else if (oldproduct.getType() == "ProcProduct") {
      await ProcProductsRegistry.update(oldproduct);
      await ProcProductsRegistry.add(newproduct);
    } else {
      throw new Error("product can't be identified");
    }
  }
}

/**
 * initial function to generate companies and regulator
 * @param {org.prototype.blockchainhalal.Init} init
 * @transaction
 */

async function initDemo(init) {
  var regulatorRegistry = await getParticipantRegistry(NS + ".Regulator");
  var supplierRegistry = await getParticipantRegistry(NS + ".SupplyCompany");
  var manuRegistry = await getParticipantRegistry(NS + ".ManufacturingCompany");
  var distRegistry = await getParticipantRegistry(NS + ".DistributionCompany");
  var retailRegistry = await getParticipantRegistry(NS + ".RetailCompany");
  var factory = getFactory();
  // Create Demo Regulator

  var DemoRegulator = factory.newResource(
    NS,
    "Regulator",
    "DemoRegulator@blockchainhalal.org"
  );
  DemoRegulator.RegulatorName = "Demo Regulator";
  DemoRegulator.RegulatorBranch = "Bandung";
  DemoRegulator.RegulatorAddress = "Jl. Cisitu Lama No. 2";
  DemoRegulator.RegulatorContact = "08129717064";

  var DemoSupplier = factory.newResource(
    NS,
    "SupplyCompany",
    "DemoSupplier@blockchainhalal.org"
  );
  DemoSupplier.CompanyName = "Demo Supplier";
  DemoSupplier.CompanyDesc = " Bandung";
  DemoSupplier.CompanyAddress = "Jl. Dago Elos VII";
  DemoSupplier.CompanyContact = "0812345678";

  var DemoManufacturer = factory.newResource(
    NS,
    "ManufacturingCompany",
    "DemoManufacturer@blockchainhalal.org"
  );
  DemoManufacturer.CompanyName = "Demo Manufacturer";
  DemoManufacturer.CompanyDesc = " Bandung";
  DemoManufacturer.CompanyAddress = "Jl. Dago Asri VIII";
  DemoManufacturer.CompanyContact = "12345678";

  var DemoDistributor = factory.newResource(
    NS,
    "DistributionCompany",
    "DemoDistributor@blockchainhalal.org"
  );
  DemoDistributor.CompanyName = "Demo Distributor";
  DemoDistributor.CompanyDesc = " Bandung";
  DemoDistributor.CompanyAddress = "Jl. Ganesha no.10 bbb";
  DemoDistributor.CompanyContact = "98765432";

  var DemoRetailer = factory.newResource(
    NS,
    "RetailCompany",
    "DemoRetailer@blockchainhalal.org"
  );
  DemoRetailer.CompanyName = "Demo Retailer";
  DemoRetailer.CompanyDesc = " Bandung";
  DemoRetailer.CompanyAddress = "Jl. Dago Asri VIII";
  DemoRetailer.CompanyContact = "12345678";

  await regulatorRegistry.add(DemoRegulator);
  await supplierRegistry.add(DemoSupplier);
  await manuRegistry.add(DemoManufacturer);
  await distRegistry.add(DemoDistributor);
  await retailRegistry.add(DemoRetailer);
}
