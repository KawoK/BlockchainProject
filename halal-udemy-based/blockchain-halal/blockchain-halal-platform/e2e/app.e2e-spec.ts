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

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for blockchain-halal-platform', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be blockchain-halal-platform', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('blockchain-halal-platform');
    })
  });

  it('network-name should be blockchain-halal@0.0.1',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('blockchain-halal@0.0.1.bna');
    });
  });

  it('navbar-brand should be blockchain-halal-platform',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('blockchain-halal-platform');
    });
  });

  
    it('RawProduct component should be loadable',() => {
      page.navigateTo('/RawProduct');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('RawProduct');
      });
    });

    it('RawProduct table should have 9 columns',() => {
      page.navigateTo('/RawProduct');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('ProcProduct component should be loadable',() => {
      page.navigateTo('/ProcProduct');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ProcProduct');
      });
    });

    it('ProcProduct table should have 9 columns',() => {
      page.navigateTo('/ProcProduct');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('Package component should be loadable',() => {
      page.navigateTo('/Package');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Package');
      });
    });

    it('Package table should have 5 columns',() => {
      page.navigateTo('/Package');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Regulator component should be loadable',() => {
      page.navigateTo('/Regulator');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Regulator');
      });
    });

    it('Regulator table should have 5 columns',() => {
      page.navigateTo('/Regulator');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  
    it('SupplyCompany component should be loadable',() => {
      page.navigateTo('/SupplyCompany');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SupplyCompany');
      });
    });

    it('SupplyCompany table should have 7 columns',() => {
      page.navigateTo('/SupplyCompany');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('ManufacturingCompany component should be loadable',() => {
      page.navigateTo('/ManufacturingCompany');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ManufacturingCompany');
      });
    });

    it('ManufacturingCompany table should have 7 columns',() => {
      page.navigateTo('/ManufacturingCompany');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('DistributionCompany component should be loadable',() => {
      page.navigateTo('/DistributionCompany');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DistributionCompany');
      });
    });

    it('DistributionCompany table should have 7 columns',() => {
      page.navigateTo('/DistributionCompany');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('RetailCompany component should be loadable',() => {
      page.navigateTo('/RetailCompany');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('RetailCompany');
      });
    });

    it('RetailCompany table should have 7 columns',() => {
      page.navigateTo('/RetailCompany');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('CreateRawProduct component should be loadable',() => {
      page.navigateTo('/CreateRawProduct');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CreateRawProduct');
      });
    });
  
    it('CreateProcProduct component should be loadable',() => {
      page.navigateTo('/CreateProcProduct');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CreateProcProduct');
      });
    });
  
    it('SendPackage component should be loadable',() => {
      page.navigateTo('/SendPackage');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SendPackage');
      });
    });
  
    it('ReveivePackage component should be loadable',() => {
      page.navigateTo('/ReveivePackage');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('ReveivePackage');
      });
    });
  
    it('PackProduct component should be loadable',() => {
      page.navigateTo('/PackProduct');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PackProduct');
      });
    });
  

});