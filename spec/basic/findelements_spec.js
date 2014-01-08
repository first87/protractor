var util = require('util');

describe('locators', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  describe('by binding', function() {
    it('should find an element by binding', function() {
      var greeting = element(by.binding('{{greeting}}'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find a binding by partial match', function() {
      var greeting = element(by.binding('greet'));

      expect(greeting.getText()).toEqual('Hiya');
    });

    it('should find an element by binding with ng-bind attribute',
        function() {
      var name = element(by.binding('username'));

      expect(name.getText()).toEqual('Anon');
    });

    it('should find an element by binding with ng-bind-template attribute',
        function() {
      var name = element(by.binding('{{username|uppercase}}'));

      expect(name.getText()).toEqual('ANON');
    });
  });

  describe('by model', function() {
    it('should find an element by text input model', function() {
      var username = element(by.model('username'));
      username.clear();
      username.sendKeys('Jane Doe');

      var name = element(by.binding('username'));

      expect(name.getText()).toEqual('Jane Doe');
    });

    it('should find an element by checkbox input model', function() {
      expect(element(by.id('shower')).isDisplayed()).
          toBe(true);

      var colors = element(by.model('show')).click();

      expect(element(by.id('shower')).isDisplayed()).
          toBe(false);
    });

    it('should find a textarea by model', function() {
      var about = element(by.model('aboutbox'));
      expect(about.getAttribute('value')).toEqual('This is a text box');

      about.clear();
      about.sendKeys('Something else to write about');

      expect(about.getAttribute('value')).
          toEqual('Something else to write about');
    });

    it('should find an element by textarea model', function() {
      // Note: deprecated API.
      var about = element(by.textarea('aboutbox'));
      expect(about.getAttribute('value')).toEqual('This is a text box');

      about.clear();
      about.sendKeys('Something else to write about');

      expect(about.getAttribute('value')).
          toEqual('Something else to write about');
    });

    it('should find multiple selects by model', function() {
      var selects = element.all(by.model('dayColor.color'));
      expect(selects.count()).toEqual(3);
    });

    it('should find inputs with alternate attribute forms', function() {
      var letterList = element(by.id('letterlist'));
      expect(letterList.getText()).toBe('');

      element(by.model('check.w')).click();
      expect(letterList.getText()).toBe('w');

      element(by.model('check.x')).click();
      expect(letterList.getText()).toBe('wx');

      element(by.model('check.y')).click();
      expect(letterList.getText()).toBe('wxy');

      element(by.model('check.z')).click();
      expect(letterList.getText()).toBe('wxyz');
    });

    it('should find multiple inputs', function() {
      browser.findElements(by.model('color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });
  });

  describe('by select', function() {
    it('should find multiple selects', function() {
      // Note: deprecated API.
      browser.findElements(by.select('dayColor.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
      });
    });

    it('should find the selected option', function() {
      expect(element(by.selectedOption('fruit')).getText()).toEqual('apple');
    });

    it('should find multiple selected options', function() {
      element.all(
          by.selectedOption('dayColor.color')).then(function(arr) {
        expect(arr.length).toEqual(3);
        expect(arr[0].getText()).toBe('red');
        expect(arr[1].getText()).toBe('green');
        expect(arr[2].getText()).toBe('blue');
      });
    });
  });

  describe('by repeater', function() {
    beforeEach(function() {
      browser.get('index.html#/repeater');
    });

    it('should find by partial match', function() {
      var fullMatch = element(
          by.repeater('baz in days | filter:\'T\'').
              row(0).column('{{baz.initial}}'));
      expect(fullMatch.getText()).toEqual('T');

      var partialMatch = element(
          by.repeater('baz in days').row(0).column('b'));
      expect(partialMatch.getText()).toEqual('T');

      var partialRowMatch = element(
          by.repeater('baz in days').row(0));
      expect(partialRowMatch.getText()).toEqual('T');
    });

    it('should return all rows when unmodified', function() {
      var all =
          element.all(by.repeater('allinfo in days'));
      all.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M Monday');
        expect(arr[1].getText()).toEqual('T Tuesday');
        expect(arr[2].getText()).toEqual('W Wednesday');
      });
    });

    it('should return a single column', function() {
      var initials = element.all(
          by.repeater('allinfo in days').column('initial'));
      initials.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('M');
        expect(arr[1].getText()).toEqual('T');
        expect(arr[2].getText()).toEqual('W');
      });

      var names = element.all(
          by.repeater('allinfo in days').column('name'));
      names.then(function(arr) {
        expect(arr.length).toEqual(5);
        expect(arr[0].getText()).toEqual('Monday');
        expect(arr[1].getText()).toEqual('Tuesday');
        expect(arr[2].getText()).toEqual('Wednesday');
      });
    });

    it('should return a single row', function() {
      var secondRow = element(
          by.repeater('allinfo in days').row(1));
      expect(secondRow.getText()).toEqual('T Tuesday');
    });

    it('should return an individual cell', function() {
      var secondNameByRowFirst = element(
          by.repeater('allinfo in days').
          row(1).
          column('name'));

      var secondNameByColumnFirst = element(
          by.repeater('allinfo in days').
          column('name').
          row(1));

      expect(secondNameByRowFirst.getText()).toEqual('Tuesday');
      expect(secondNameByColumnFirst.getText()).toEqual('Tuesday');
    });

    it('should find a using data-ng-repeat', function() {
      var byRow =
        element(by.repeater('day in days').row(2));
      expect(byRow.getText()).toEqual('W');

      var byCol =
          element(by.repeater('day in days').row(2).
          column('day'));
      expect(byCol.getText()).toEqual('W');
    });

    it('should find using ng:repeat', function() {
      var byRow =
        element(by.repeater('bar in days').row(2));
      expect(byRow.getText()).toEqual('W');

      var byCol =
          element(by.repeater('bar in days').row(2).
          column('bar'));
      expect(byCol.getText()).toEqual('W');
    });

    it('should find using ng_repeat', function() {
      var byRow =
        element(by.repeater('foo in days').row(2));
      expect(byRow.getText()).toEqual('W');

      var byCol =
          element(by.repeater('foo in days').row(2).
          column('foo'));
      expect(byCol.getText()).toEqual('W');
    });

    it('should find using x-ng-repeat', function() {
      var byRow =
        element(by.repeater('qux in days').row(2));
      expect(byRow.getText()).toEqual('W');

      var byCol =
          element(by.repeater('qux in days').row(2).
          column('qux'));
      expect(byCol.getText()).toEqual('W');
    });

    it('should determine if repeater elements are present', function() {
      expect(element(by.repeater('allinfo in days').row(3)).isPresent()).
          toBe(true);
      // There are only 5 rows, so the 6th row is not present.
      expect(element(by.repeater('allinfo in days').row(5)).isPresent()).
          toBe(false);
    });

    describe('repeaters using ng-repeat-start and ng-repeat-end', function() {
      it('should return all elements when unmodified', function() {
        var all =
            element.all(by.repeater('bloop in days'));

        all.then(function(arr) {
          expect(arr.length).toEqual(3 * 5);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
          expect(arr[3].getText()).toEqual('T');
          expect(arr[4].getText()).toEqual('-');
          expect(arr[5].getText()).toEqual('Tuesday');
        });
      });

      it('should return a group of elements for a row', function() {
        var firstRow = element.all(by.repeater('bloop in days').row(0));

        firstRow.then(function(arr) {
          expect(arr.length).toEqual(3);
          expect(arr[0].getText()).toEqual('M');
          expect(arr[1].getText()).toEqual('-');
          expect(arr[2].getText()).toEqual('Monday');
        });
      });

      it('should return a group of elements for a column', function() {
        var nameColumn = element.all(
          by.repeater('bloop in days').column('name'));

        nameColumn.then(function(arr) {
          expect(arr.length).toEqual(5);
          expect(arr[0].getText()).toEqual('Monday');
          expect(arr[1].getText()).toEqual('Tuesday');
        });
      });

      it('should find an individual element', function() {
        browser.debugger();
        var firstInitial = element(
          by.repeater('bloop in days').row(0).column('bloop.initial'));

        expect(firstInitial.getText()).toEqual('M');
      });
    });
  });

  it('should determine if an element is present', function() {
    expect(browser.isElementPresent(by.binding('greet'))).toBe(true);
    expect(browser.isElementPresent(by.binding('nopenopenope'))).toBe(false);
  });
});

describe('chaining find elements', function() {
  beforeEach(function() {
    browser.get('index.html#/conflict');
  });

  it('should differentiate elements with the same binding by chaining',
    function() {
      expect(element(
        by.binding('item.reusedBinding')).getText()).
          toEqual('Outer: outer');

        expect(element(by.id('baz')).findElement(
            by.binding('item.reusedBinding')).
            getText()).
            toEqual('Inner: inner');
  });

  it('should find multiple elements scoped properly with chaining',
    function() {
      element.all(by.binding('item')).then(function(elems) {
        expect(elems.length).toEqual(4);
      });

      element(by.id('baz')).
          findElements(by.binding('item')).
          then(function(elems) {
            expect(elems.length).toEqual(2);
          });
    });

  it('should determine element presence properly with chaining', function() {
    expect(element(by.id('baz')).
        isElementPresent(by.binding('item.reusedBinding'))).
        toBe(true);

    expect(element(by.id('baz')).
      isElementPresent(by.binding('nopenopenope'))).
      toBe(false);
  });
});

describe('global element function', function() {
  it('should return the same result as browser.findElement', function() {
    browser.get('index.html#/form');
    var nameByElement = element(by.binding('username'));
    expect(nameByElement.getText()).toEqual(
        browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', function() {
    browser.driver.get('about:blank');

    // These should throw no error before a page is loaded.
    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    browser.get('index.html#/form');

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear();
    usernameInput.sendKeys('Jane');
    expect(name.getText()).toEqual('Jane');
  });

  it('should count all elements', function() {
    browser.get('index.html#/form');

    element.all(by.model('color')).count().then(function(num) {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(element.all(by.model('color')).count()).toEqual(3);
  });

  it('should get an element from an array', function() {
    var colorList = element.all(by.model('color'));

    browser.get('index.html#/form');

    expect(colorList.get(0).getAttribute('value')).toEqual('blue');
    expect(colorList.get(1).getAttribute('value')).toEqual('green');
    expect(colorList.get(2).getAttribute('value')).toEqual('red');
  });

  it('should get the first element from an array', function() {
    var colorList = element.all(by.model('color'));
    browser.get('index.html#/form');

    expect(colorList.first(0).getAttribute('value')).toEqual('blue');
  });

  it('should get the last element from an array', function() {
    var colorList = element.all(by.model('color'));
    browser.get('index.html#/form');

    expect(colorList.last(0).getAttribute('value')).toEqual('red');
  });

  it('should perform an action on each element in an array', function() {
    var colorList = element.all(by.model('color'));
    colorList.each(function(colorElement) {
      expect(colorElement.getText()).not.toEqual('purple');
    });
  });

  it('should map each element on array and with promises', function() {
    var labels = element.all(by.css('.menu li a')).map(function(elm) {
      return elm.getText();
    });
    browser.get('index.html#/form');

    expect(labels).toEqual(
        ['repeater', 'bindings', 'form', 'async', 'conflict', 'polling']);
  });

  it('should map each element from a literal and promise array', function() {
    var i = 1;
    var labels = element.all(by.css('.menu li a')).map(function(elm) {
      return i++;
    });
    browser.get('index.html#/form');

    expect(labels).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should export an isPresent helper', function() {
    expect(element(by.binding('greet')).isPresent()).toBe(true);
    expect(element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });
});

describe('evaluating statements', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should evaluate statements in the context of an element', function() {
    var checkboxElem = element(by.id('checkboxes'));

    checkboxElem.evaluate('show').then(function(output) {
      expect(output).toBe(true);
    });

    // Make sure it works with a promise expectation.
    expect(checkboxElem.evaluate('show')).toBe(true);
  });
});

describe('shortcut css notation', function() {
  beforeEach(function() {
    browser.get('index.html#/bindings');
  });

  describe('via the driver', function() {
    it('should return the same results as web driver', function() {
      element(by.css('.planet-info')).getText().then(function(textFromLongForm) {
        var textFromShortcut = $('.planet-info').getText();
        expect(textFromShortcut).toEqual(textFromLongForm);
      });
    });

    it('should return the same array results as web driver', function() {
      element.all(by.css('option')).then(function(optionsFromLongForm) {
        $$('option').then(function(optionsFromShortcut) {
          expect(optionsFromShortcut.length).toEqual(optionsFromLongForm.length);

          optionsFromLongForm.forEach(function(option, i) {
            option.getText().then(function(textFromLongForm) {
              expect(optionsFromShortcut[i].getText()).toEqual(textFromLongForm);
            });
          });
        });
      });
    });
  });

  describe('via a web element', function() {
    var select;

    beforeEach(function() {
      select = element(by.css('select'));
    });

    it('should return the same results as web driver', function() {
      select.findElement(by.css('option[value="4"]')).getText().then(function(textFromLongForm) {
        var textFromShortcut = select.$('option[value="4"]').getText();
        expect(textFromShortcut).toEqual(textFromLongForm);
      });
    });

    it('should return the same array results as web driver', function() {
      select.findElements(by.css('option')).then(function(optionsFromLongForm) {
        select.$$('option').then(function(optionsFromShortcut) {
          expect(optionsFromShortcut.length).toEqual(optionsFromLongForm.length);

          optionsFromLongForm.forEach(function(option, i) {
            option.getText().then(function(textFromLongForm) {
              expect(optionsFromShortcut[i].getText()).toEqual(textFromLongForm);
            });
          });
        });
      });
    });
  });
});

describe('wrapping web driver elements', function() {
  var verifyMethodsAdded = function(result) {
    expect(typeof result.evaluate).toBe('function');
    expect(typeof result.$).toBe('function');
    expect(typeof result.$$).toBe('function');
  }

  beforeEach(function() {
    browser.get('index.html#/bindings');
  });

  describe('when found via #findElement', function() {
    it('should wrap the result', function() {
      browser.findElement(by.binding('planet.name')).then(verifyMethodsAdded);

      browser.findElement(by.css('option[value="4"]')).then(verifyMethodsAdded);
    });

    describe('when found with global element', function() {
      it('should wrap the result', function() {
        element(by.binding('planet.name')).find().then(verifyMethodsAdded);
        element(by.css('option[value="4"]')).find().then(verifyMethodsAdded);
      });
    });
  });

  describe('when found via #findElements', function() {
    it('should wrap the results', function() {
      browser.findElements(by.binding('planet.name')).then(function(results) {
        results.forEach(verifyMethodsAdded);
      });
      browser.findElements(by.css('option[value="4"]')).then(function(results) {
        results.forEach(verifyMethodsAdded);
      });
    });

    describe('when found with global element', function() {
      it('should wrap the result', function() {
        element.all(by.binding('planet.name')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
        element.all(by.binding('planet.name')).get(0).then(function(elem) {
          elem.verifyMethodsAdded;
        });
        element.all(by.binding('planet.name')).first().then(function(elem) {
          elem.verifyMethodsAdded;
        });
        element.all(by.binding('planet.name')).last().then(function(elem) {
          elem.verifyMethodsAdded;
        });
        element.all(by.css('option[value="4"]')).then(function(results) {
          results.forEach(verifyMethodsAdded);
        });
      });
    });
  });

  describe('when querying against a found element', function() {
    var info;

    beforeEach(function() {
      info = browser.findElement(by.css('.planet-info'));
    });

    describe('when found via #findElement', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the result', function() {
          info.findElement(by.binding('planet.name')).then(verifyMethodsAdded);
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the result', function() {
          info.findElement(by.css('div:last-child')).then(verifyMethodsAdded);
        });
      });
    });

    describe('when querying for many elements', function() {
      describe('when using a locator that specifies an override', function() {
        it('should wrap the result', function() {
          info.findElements(by.binding('planet.name')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });

      describe('when using a locator that does not specify an override', function() {
        it('should wrap the result', function() {
          info.findElements(by.css('div:last-child')).then(function(results) {
            results.forEach(verifyMethodsAdded);
          });
        });
      });
    });
  });
});
