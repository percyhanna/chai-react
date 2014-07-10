(function (chaiReact) {
  // Module systems magic dance.
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = chaiReact;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(['react'], function (React) {
      return function (chai, utils) {
        return chaiReact(chai, utils, React);
      };
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(function (chai, utils) {
      return chaiReact(chai, utils, React);
    });
  }
}(function (chai, utils, React) {
  var flag = utils.flag,
      TestUtils = React.addons.TestUtils;

  chai.Assertion.addMethod('state', function (name, value) {
    var component = flag(this, 'object'),
        state = component.state || {},
        actual = state[name];

    new chai.Assertion(component).is.a.component;

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
        actual,
        value
      );
    }

    flag(this, 'object', actual);
  });

  chai.Assertion.addMethod('prop', function (name, value) {
    var component = flag(this, 'object'),
        props = component.props || {},
        actual = props[name];

    new chai.Assertion(component).is.a.component;

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

  chai.Assertion.addMethod('componentsOfType', function (type) {
    var actual, component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;

    actual = TestUtils.findAllInRenderedTree(component, function (comp) {
      return TestUtils.isComponentOfType(comp, type);
    });

    flag(this, 'object', actual);
  });

  chai.Assertion.addProperty('component', function () {
    var component = flag(this, 'object');

    this.assert(
      TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component),
      'expected #{this} to be a valid React component, but it is not',
      'expected #{this} to not be a valid React component, but it is'
    );
  });
}));
