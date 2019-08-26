import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.prototype.blockchainhalal{
   export class Regulator extends Participant {
      RegulatorID: string;
      RegulatorName: string;
      RegulatorBranch: string;
      RegulatorAdress: string;
   }
   export abstract class Company extends Participant {
      CompanyId: string;
      CompanyName: string;
      CompanyDesc: string;
      CompanyAdress: string;
      CompanyContact: string;
   }
   export class SupplyCompany extends Company {
      Type: CompanyType;
   }
   export class ManufacturingCompany extends Company {
      Type: CompanyType;
   }
   export class DistributionCompany extends Company {
      Type: CompanyType;
   }
   export class RetailCompany extends Company {
      Type: CompanyType;
   }
   export abstract class Product extends Asset {
      productID: string;
      Owner: Company;
      productDesc: string;
      productStatus: ProductStatus;
      productionDate: string;
      expirationDate: string;
      CertificateLink: string;
   }
   export class RawProduct extends Product {
      ingredientsType: IngredientType;
   }
   export class ProcProduct extends Product {
      composition: Product[];
   }
   export class Package extends Asset {
      packageID: string;
      packageName: string;
      Owner: Company;
      productPackaged: Product[];
   }
   export enum IngredientType {
      Hewan,
      Tumbuhan,
      ZatKimia,
      Mikroba,
      Not_Specified,
   }
   export enum ProcProductType {
      PackagedProduct,
      UnpackagedProduct,
   }
   export enum ProductStatus {
      Created,
      Expired,
      Processed,
      In_Transit,
      Received,
      Packaged,
      Sold,
   }
   export enum ParticipantType {
      Regulator,
      Companies,
   }
   export enum CompanyType {
      Supplier,
      Manufacturer,
      Distributor,
      Retailer,
   }
   export class CreateRawProduct extends Transaction {
      productID: string;
      Owner: Company;
      productDesc: string;
      productStatus: ProductStatus;
      productionDate: string;
      expirationDate: string;
      IngredientType: IngredientType;
      CertificateLink: string;
   }
   export class CreateProcProduct extends Transaction {
      productID: string;
      Owner: Company;
      productDesc: string;
      productStatus: ProductStatus;
      productionDate: string;
      expirationDate: string;
      composition: Product[];
      CertificateLink: string;
   }
   export class SendPackage extends Transaction {
      ShippedPackage: Package;
      NewOwner: Company;
      CurrentOwner: Company;
   }
   export class ReveivePackage extends Transaction {
      ShippedPackage: Package;
      NewOwner: Company;
      CurrentOwner: Company;
   }
   export class PackProduct extends Transaction {
      ProductList: Product[];
   }
// }
