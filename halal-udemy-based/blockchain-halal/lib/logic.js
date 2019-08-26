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
/**
 * Write your transction processor functions here
 */

/**
 * This is just a function that will setup a new participant and asset for demo purpose only. not for real application business logic
 * @param {org.prototype.blockchainhalal.InitialNetworkParticipantSetUp} InitialSetUp
 * @transaction
 */

 async function InitialSetUp{

 }

/**
 *  Function to Create a New Raw Product
 *  Can only be executed by peer type supplier or class rawmaterial company
 *  @param {org.prototype.blockchainhalal.CreateRawProduct} rawProductData
 *  @transaction
 */
async function CreateRawProduct(rawProductData) {

}
async function createProcProduct() {}

// This function only can be called by function receive product, with the condition the receiver choose to reject the product
// Product can be rejected if it's not in good condition
// Input
async function returnProduct() {}
async function packProduct() {}
async function sendProduct() {}
async function receiveProduct() {}
