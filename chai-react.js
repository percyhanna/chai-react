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

  function inspectify (component) {
    component.inspect = function () {
      return 'React component';
    };
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
      if (value !== undefined) {
        var prop = comp.props[name];

        switch (match) {
          case 'contains':
            return typeof prop === 'string' && prop.indexOf(value) !== -1;

          default:
            return prop === value;
        }
      }

      return !TestUtils.isTextComponent(comp) && name in comp.props;
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

  chai.Assertion.addMethod('componentsWithTag', function (tag) {
    var components = [];
    var component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;
    inspectify(component);

    components = TestUtils.scryRenderedDOMComponentsWithTag(component, tag);

    flag(this, 'object', components);
  });

  chai.Assertion.addMethod('textComponent', function (text) {
    var actual, component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;

    inspectify(component);

    var textComponents = TestUtils.findAllInRenderedTree(component, function (comp) {
      return TestUtils.isTextComponent(comp) || typeof comp.props.children === 'string';
    });

    new chai.Assertion(textComponents).has.length.gt(0);

    var foundMatch = false;
    for (var i = 0; i < textComponents.length; i++) {
      if (textComponents[i].props === text || textComponents[i].props.children === text) {
        flag(this, 'object', textComponents[i]);
        foundMatch = true;
        break;
      }
    }

    this.assert(
      foundMatch,
      'expected component tree to have a text component with text #{exp}, but none was found.',
      'expected component tree to not have a text component with text #{exp}, but one was found.',
      text
    );
  });

  chai.Assertion.addProperty('component', function () {
    var component = flag(this, 'object');

    this.assert(
      TestUtils.isDOMComponent(component) || TestUtils.isCompositeComponent(component),
      'expected #{this} to be a valid React component, but it is not',
      'expected #{this} to not be a valid React component, but it is'
    );
  });

  chai.Assertion.addProperty('reactClass', function () {
    var reactClass = flag(this, 'object');

    this.assert(
      React.isValidClass(reactClass),
      'expected #{this} to be a valid React class, but it is not',
      'expected #{this} to not be a valid React class, but it is'
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

  chai.Assertion.addMethod('triggerEvent', function (eventName, args) {
    var component = flag(this, 'object');

    new chai.Assertion(component).is.a.component;

    new chai.Assertion(React.addons.TestUtils.Simulate[eventName]).is.a('function');

    React.addons.TestUtils.Simulate[eventName](component.getDOMNode(), args);
  });
}));
