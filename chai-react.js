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
  var flag = utils.flag;

  chai.Assertion.addMethod('state', function (name, value) {
    var component = flag(this, 'object'),
        state = component.state || {},
        actual = state[name];

    if (!flag(this, 'negate') || undefined === value) {
      this.assert(
        undefined !== actual,
        'expected #{this} to have state \'' + name + '\' #{exp}',
        'expected #{this} not to have state \'' + name + '\' #{exp}'
      );
    }

    if (undefined !== value) {
      this.assert(
        value === actual,
        'expected #{this} to have state \'' + name + '\' with the value #{exp}, but the value was #{act}',
        'expected #{this} not to have state \'' + name + '\' with the value #{act}'
      );
    }

    flag(this, 'object', actual);
  });

  chai.Assertion.addMethod('prop', function (name, value) {
    var component = flag(this, 'object'),
        props = component.props || {},
        actual = props[name];

    if (!flag(this, 'negate') || undefined === value) {
      this.assert(
        undefined !== actual,
        'expected #{this} to have prop \'' + name + '\' defined',
        'expected #{this} not to have prop \'' + name + '\' defined'
      );
    }

    if (undefined !== value) {
      this.assert(
        value === actual,
        'expected #{this} to have prop \'' + name + '\' with the value #{exp}, but the value was #{act}',
        'expected #{this} not to have prop \'' + name + '\' with the value #{act}',
        value,
        actual
      );
    }

    flag(this, 'object', actual);
  });

  chai.Assertion.addMethod('components', function (type) {
    var component = flag(this, 'object'),
        actual = React.addons.TestUtils.findAllInRenderedTree(component, function (comp) {
          return React.addons.TestUtils.isComponentOfType(comp, type);
        });

    flag(this, 'object', actual);
  });
}));
