describe('chai-react', function() {
  chai.use(function (chai, utils) {
    inspect = utils.objDisplay;

    chai.Assertion.addMethod('fail', function (message) {
      var obj = utils.flag(this, 'object');

      new chai.Assertion(obj).is.a('function');

      try {
        obj();
      } catch (err) {
        this.assert(
          err instanceof chai.AssertionError,
          'expected #{this} to fail, but it threw ' + inspect(err)
        );

        this.assert(
          err.message === message,
          'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message)
        );

        return;
      }

      this.assert(false, 'expected #{this} to fail');
    });
  });

  var utils = React.addons.TestUtils;

  var testComponent = React.createClass({
    render: function () {
      return (
        React.DOM.div(
          { className: 'abc testing-class' },
          React.DOM.span({}, 'my span text'),
          'separator text',
          React.DOM.span({}, 'my other span text'),
          childComponent({}),
          childComponent({ myVar: 5 })
        )
      );
    }
  });

  var childComponent = React.createClass({
    getDefaultProps: function () {
      return {
        myVar: 1,
        defaultProp: 'my-default-prop'
      };
    },

    getInitialState: function () {
      return {
        myState: this.props.myVar * 2,
        someState: 'my-default-state'
      };
    },

    render: function () {
      return (
        React.DOM.div(
          {},
          React.DOM.p({}, 'Hello, this is my state: ', this.state.myState),
          React.DOM.p({}, 'Hello, this is some state: ', this.state.someState),
          React.DOM.p({}, 'Child text')
        )
      );
    }
  })

  describe('state', function () {
    it('works with initial state for top-level component', function() {
      var component = utils.renderIntoDocument(childComponent());

      expect(component).to.have.state('myState', 2);
    });

    it('allows chaining of other assertions', function() {
      var component = utils.renderIntoDocument(childComponent());

      expect(component).to.have.state('myState').gt(1);
    });

    it('works if expected value does not match, but is negated', function() {
      var component = utils.renderIntoDocument(childComponent());

      expect(component).to.not.have.state('myState', 3);
    });

    it('works if it does not have state', function() {
      var component = utils.renderIntoDocument(childComponent());

      expect(component).to.not.have.state('someOtherState');
    });

    it('fails if state does not match expected value', function() {
      expect(function () {
        var component = utils.renderIntoDocument(childComponent());
        expect(component).to.have.state('myState', 3);
      }).to.fail('expected component to have state \'myState\' with the value 2, but the value was 3');
    });

    it('fails with a non component', function() {
      expect(function () {
        expect('').to.have.state('myState', 3);
      }).to.fail('expected \'\' to be a valid React component, but it is not');
    });
  });

  describe('prop', function () {
    it('works with default prop for top-level component', function() {
      var component = utils.renderIntoDocument(childComponent({ myVar: 5 }));

      expect(component).to.have.prop('myVar', 5);
    });

    it('allows chaining of other assertions', function() {
      var component = utils.renderIntoDocument(childComponent({ myVar: 5 }));

      expect(component).to.have.prop('myVar').gt(4);
    });

    it('works if expected value does not match, but is negated', function() {
      var component = utils.renderIntoDocument(childComponent({ myVar: 5 }));

      expect(component).to.not.have.prop('myVar', 3);
    });

    it('works if it does not have prop', function() {
      var component = utils.renderIntoDocument(childComponent({ myVar: 5 }));

      expect(component).to.not.have.prop('someOtherProp');
    });

    it('fails if prop does not match expected value', function() {
      expect(function () {
        var component = utils.renderIntoDocument(childComponent({ myVar: 5 }));
        expect(component).to.have.prop('myVar', 3);
      }).to.fail('expected component to have prop \'myVar\' with the value 3, but the value was 5');
    });

    it('fails with a non component', function() {
      expect(function () {
        expect('').to.have.prop('myState', 3);
      }).to.fail('expected \'\' to be a valid React component, but it is not');
    });
  });

  describe('componentsWithProp', function () {
    it('retrieves descendant components with prop', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).componentsWithProp('myVar').to.have.length(2);
    });

    it('filters descendant components with specific prop value', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).componentsWithProp('myVar', 5).to.have.length(1);
    });

    it('fails with a non component', function() {
      expect(function () {
        expect('').componentsWithProp('myVar');
      }).to.fail('expected \'\' to be a valid React component, but it is not');
    });

    describe('state', function () {
      it('allows diving into state of a found component', function () {
        var component = utils.renderIntoDocument(testComponent());

        expect(component).componentsWithProp('myVar').first.to.have.state('myState', 2);
        expect(component).componentsWithProp('myVar').last.to.have.state('myState', 10);
      });
    });

    describe('prop', function () {
      it('allows diving into props of a found component', function () {
        var component = utils.renderIntoDocument(testComponent());

        expect(component).componentsWithProp('myVar').first.to.have.prop('myVar', 1);
        expect(component).componentsWithProp('myVar').last.to.have.prop('myVar', 5);
      });
    });
  });

  describe('componentsOfType', function () {
    it('retrieves descendant components of type', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).componentsOfType(React.DOM.p).to.have.length(6);
    });

    it('fails with a non component', function() {
      expect(function () {
        expect('').componentsOfType(React.DOM.p);
      }).to.fail('expected \'\' to be a valid React component, but it is not');
    });

    describe('state', function () {
      it('allows diving into state of a found component', function () {
        var component = utils.renderIntoDocument(testComponent());

        expect(component).componentsOfType(childComponent).first.to.have.state('myState', 2);
        expect(component).componentsOfType(childComponent).last.to.have.state('myState', 10);
      });
    });

    describe('prop', function () {
      it('allows diving into props of a found component', function () {
        var component = utils.renderIntoDocument(testComponent());

        expect(component).componentsOfType(childComponent).first.to.have.prop('myVar', 1);
        expect(component).componentsOfType(childComponent).last.to.have.prop('myVar', 5);
      });
    });
  });

  describe('textComponent', function () {
    it('matches plain text components', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).to.have.textComponent('separator text');
    });

    it('matches component child text', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).to.have.textComponent('Child text');
    });

    it('negative assertions work', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).to.not.have.textComponent('abc');
    });

    it('fails when text is not found', function() {
      var component = utils.renderIntoDocument(testComponent());

      expect(function () {
        expect(component).to.have.textComponent('abc');
      }).to.fail('expected component tree to have a text component with text \'abc\', but none was found.');
    });

    it('fails with a non component', function() {
      expect(function () {
        expect('').to.have.textComponent('abc');
      }).to.fail('expected \'\' to be a valid React component, but it is not');
    });
  });

  describe('component', function () {
    it('passes with a valid component', function () {
      var component = utils.renderIntoDocument(testComponent());

      expect(component).to.be.a.component;
    });

    it('fails with a non component', function() {
      expect('').to.not.be.a.component;
    });
  });
});
