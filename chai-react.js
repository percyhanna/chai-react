(function (chaiReact) {
  // Module systems magic dance.
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = function (chai, utils) {
      return chaiReact(chai, utils, require('react'), require('react-dom/test-utils'));
    };
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(['react', 'react-dom/test-utils'], function (React, TestUtils) {
      return function (chai, utils) {
        return chaiReact(chai, utils, React, TestUtils);
      };
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(function (chai, utils) {
      return chaiReact(chai, utils, React, ReactTestUtils);
    });
  }
}(function (chai, utils, React, TestUtils) {
  var flag = utils.flag;

  function inspectify (component) {
    component.inspect = function () {
      return 'React component';
    };
  }

  function getComponentProp (component, prop) {
    if (TestUtils.isDOMComponent(component)) {
      if (prop === 'className') {
        return component.className;
      } else {
        return component.getAttribute(prop);
      }
    } else if (component.nodeType === Node.TEXT_NODE) {
      // Skip text nodes as they don't have any props
    } else {
      return component.props[prop];
    }
  }

  function componentHasProp (component, prop) {
    if (TestUtils.isDOMComponent(component)) {
      return component.hasAttribute(prop);
    } else {
      return component.props && prop in component.props;
    }
  }

  chai.Assertion.addMethod('state', function (name, value) {
    var component = flag(this, 'object'),
        state = component.state || {},
        actual = state[name];

    new chai.Assertion(component).is.a.component;

    inspectify(component);

    if (!flag(this, 'negate') || undefined === value) {
      this.assert(
        undefined !== actual,
        'expected component to have state \'' + name + '\' #{exp}',
        'expected component not to have state \'' + name + '\' #{exp}'
      );
    }

    if (undefined !== value) {
      this.assert(
        value === actual,
        'expected component to have state \'' + name + '\' with the value #{exp}, but the value was #{act}',
        'expected component not to have state \'' + name + '\' with the value #{act}',
        value,
        actual
      );
    }

    flag(this, 'object', actual);
  });

  chai.Assertion.addMethod('prop', function (name, value) {
    var actual,
        component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;

    actual = getComponentProp(component, name);

    inspectify(component);

    if (!flag(this, 'negate') || undefined === value) {
      this.assert(
        undefined !== actual,
        'expected component to have prop \'' + name + '\' defined',
        'expected component not to have prop \'' + name + '\' defined'
      );
    }

    if (undefined !== value) {
      this.assert(
        value === actual,
        'expected component to have prop \'' + name + '\' with the value #{exp}, but the value was #{act}',
        'expected component not to have prop \'' + name + '\' with the value #{act}',
        value,
        actual
      );
    }

    flag(this, 'object', actual);
  });

  chai.Assertion.addMethod('componentsWithProp', function (name, value, match) {
    var components,
        component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;

    inspectify(component);

    components = TestUtils.findAllInRenderedTree(component, function (comp) {
      var prop;

      if (value !== undefined) {
        prop = getComponentProp(comp, name);

        switch (match) {
          case 'contains':
            return typeof prop === 'string' && prop.indexOf(value) !== -1;

          default:
            return prop === value;
        }
      }

      return componentHasProp(comp, name);
    });

    if (undefined !== value) {
      this.assert(
        components.length > 0,
        'expected component tree to have a component with prop \'' + name + '\' with the value #{exp}',
        'expected component tree not to have prop \'' + name + '\' with the value #{exp}',
        value
      );
    } else {
      this.assert(
        components.length > 0,
        'expected component tree to have at least one component with prop \'' + name + '\' defined',
        'expected component tree not to have a component with prop \'' + name + '\' defined'
      );
    }

    flag(this, 'object', components);
  });

  chai.Assertion.addMethod('componentsOfType', function (type) {
    var components = [];
    var component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;
    inspectify(component);
    components = TestUtils.scryRenderedComponentsWithType(component, type);

    flag(this, 'object', components);
  });

  chai.Assertion.addMethod('componentOfType', function (type) {
    var component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;
    inspectify(component);
    var found = TestUtils.findRenderedComponentWithType(component, type);

    flag(this, 'object', found);
  });

  chai.Assertion.addMethod('componentsWithTag', function (tag) {
    var components = [];
    var component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;
    inspectify(component);

    components = TestUtils.scryRenderedDOMComponentsWithTag(component, tag);

    flag(this, 'object', components);
  });

  chai.Assertion.addMethod('componentWithTag', function (tag) {
    var found,
        component = flag(this, 'object');

    if (TestUtils.isDOMComponent(component)) {
      found = component.tagName.toLowerCase() === tag.toLowerCase();
    } else {
      new chai.Assertion(component).is.a.component;
      inspectify(component);

      found = TestUtils.findRenderedDOMComponentWithTag(component, tag);
    }

    flag(this, 'object', found);
  });

  chai.Assertion.addProperty('component', function () {
    var component = flag(this, 'object');

    this.assert(
      component && (TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component)),
      'expected #{this} to be a valid React component, but it is not',
      'expected #{this} to not be a valid React component, but it is'
    );
  });

  chai.Assertion.addProperty('element', function () {
    var element = flag(this, 'object');

    this.assert(
      React.isValidElement(element),
      'expected #{this} to be a valid React element, but it is not',
      'expected #{this} to not be a valid React element, but it is'
    );
  });
}));
