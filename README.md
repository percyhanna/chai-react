# chai-react

chai-react is an extension to the [chai](http://chaijs.com/) assertion library that
provides a set of React-specific assertions.

# rquery

Although `chai-react` is still a great tool for making assertions on components
themselves, it started getting a little bloated by trying to solve two problems
at once: React tree traversal and tree assertions.

A new library called [`rquery`](https://github.com/percyhanna/rquery) makes a better
attempt at focusing on React tree traversal, and leaving assertions to `chai-react`.
It provides an interface similar to jQuery for traversing rendered React trees. Use
`rquery` to travers your component's tree, and then `chai-react` to make assertions
on that traversal.

Example:

```
expect($R(component

## Contributing

To run the test suite, run `npm install` (requires
[Node.js](http://nodejs.org/) to be installed on your system), and open
`test/index.html` in your web browser.

## License

Copyright (c) 2014 Andrew Hanna

MIT License (see the LICENSE file)

## Credits

Thanks to [John Firebaugh](https://github.com/jfirebaugh) for providing
[chai-jquery](https://github.com/chaijs/chai-jquery/), which served as a
foundation for this plugin.
