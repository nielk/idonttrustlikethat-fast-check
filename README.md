# idonttrustlikethat-fast-check

**idonttrustlikethat-fast-check** is a plugin designed for [fast-check](https://fast-check.dev/). It convert [idonttrustlikethat](https://github.com/AlexGalays/idonttrustlikethat) validators to **fast-check** arbitraries. Allowing the possibility to use idtlt validators with fast-check.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/nielk/idonttrustlikethat-fast-check/main.yml?branch=main)
![monthly downloads](https://img.shields.io/npm/dm/idonttrustlikethat-fast-check)
![last commit](https://img.shields.io/github/last-commit/nielk/idonttrustlikethat-fast-check)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/idonttrustlikethat-fast-check)
![npm](https://img.shields.io/npm/v/idonttrustlikethat-fast-check)
[![codecov](https://codecov.io/github/nielk/idonttrustlikethat-fast-check/graph/badge.svg?token=USWA5N026O)](https://codecov.io/github/nielk/idonttrustlikethat-fast-check)
![license](https://img.shields.io/npm/l/idonttrustlikethat-fast-check.svg)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

Run the following command in your terminal:

```bash
npm install idonttrustlikethat-fast-check       # npm

yarn add idonttrustlikethat-fast-check          # yarn

bun add idonttrustlikethat-fast-check           # bun

pnpm add idonttrustlikethat-fast-check          # pnpm
```

## Basic usage

Creating a string fast-check arbitrary from a idtlt validator:

```typescript
import fc from 'fast-check';
import { string } from 'idonttrustlikethat';
import { inputOf } from 'idonttrustlikethat-fast-check';

const stringArbitrary = inputOf(string);

fc.assert(
  fc.property(stringArbitrary, (v) => {
    // Examples of generated values: "JT>\"C9k", "h]iD\"27;", "S", "n\\Ye", ""…

    return string.validate(v).ok;
  }),
);
```

[See playground](https://codesandbox.io/p/sandbox/idonttrustlikethat-fast-check-example-tm5zhc?file=%2Fsrc%2Findex.ts%3A10%2C20&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clqadg1pm00063b6fkwp40czb%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clqadg1pm00023b6f22jv7v5s%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clqadg1pm00033b6ff82yyvif%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clqadg1pm00053b6f4djlqo9f%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clqadg1pm00023b6f22jv7v5s%2522%253A%257B%2522id%2522%253A%2522clqadg1pm00023b6f22jv7v5s%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clqadkfwq00023b6fkfpd3vor%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A10%252C%2522startColumn%2522%253A20%252C%2522endLineNumber%2522%253A10%252C%2522endColumn%2522%253A20%257D%255D%252C%2522filepath%2522%253A%2522%252Fsrc%252Findex.ts%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%252C%257B%2522id%2522%253A%2522clqaeg14800023b6fmrnfrde0%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A14%252C%2522startColumn%2522%253A44%252C%2522endLineNumber%2522%253A14%252C%2522endColumn%2522%253A44%257D%255D%252C%2522filepath%2522%253A%2522%252Fpackage.json%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clqadkfwq00023b6fkfpd3vor%2522%257D%252C%2522clqadg1pm00053b6f4djlqo9f%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clqadg1pm00043b6fkmg3d4ik%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%252F%2522%257D%255D%252C%2522id%2522%253A%2522clqadg1pm00053b6f4djlqo9f%2522%252C%2522activeTabId%2522%253A%2522clqadg1pm00043b6fkmg3d4ik%2522%257D%252C%2522clqadg1pm00033b6ff82yyvif%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clqadg1pm00033b6ff82yyvif%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

## Examples

Here's a basic example demonstrating the usage of `inputOf`:

```typescript
import fc from 'fast-check';
import { object, array, string, isoDate, boolean, union, literal } from 'idonttrustlikethat';
import { inputOf } from 'idonttrustlikethat-fast-check';

// Define a validator
const validator = array(
  object({
    id: string,
    article: array(
      object({
        id: string,
        author: string,
        created: isoDate,
        tag: union(literal('bunny'), literal('pony'), literal('fox')),
        content: string,
        published: boolean,
      }),
    ),
  }),
);

// Generate an arbitrary based on the validator
const arbitrary = inputOf(validator);

fc.assert(fc.property(arbitrary, (v) => validator.validate(v).ok));
```

Example of generated values:

```
[
  {
    "id": "",
    "article": [
      {
        "id": "5)zKi)\\",
        "author": "C_+]J/y<",
        "created": "-178555-05-21T08:34:36.335Z",
        "tag": "fox",
        "content": "}6f8z",
        "published": false
      }
    ]
  },
  {
    "id": "pr",
    "article": [
      {
        "id": ")s",
        "author": ":.p+G",
        "created": "+245858-09-13T13:56:40.856Z",
        "tag": "fox",
        "content": "19\\vYI.",
        "published": true
      },
      {
        "id": "{+<~o?$m",
        "author": " r",
        "created": "-171760-01-02T20:31:07.117Z",
        "tag": "bunny",
        "content": "dMY(sMG",
        "published": true
      },
      {
        "id": "!H:uO(",
        "author": ")]z9Z22;",
        "created": "-120713-12-31T15:25:27.309Z",
        "tag": "fox",
        "content": "j2cA,zb",
        "published": true
      },
      {
        "id": "w1+g",
        "author": "$",
        "created": "+239963-03-06T02:44:13.390Z",
        "tag": "fox",
        "content": "4p<n=V",
        "published": false
      },
      {
        "id": "jp,,/+W",
        "author": "4uj",
        "created": "-067112-09-29T19:48:43.189Z",
        "tag": "pony",
        "content": "LdH?",
        "published": false
      },
      {
        "id": "a5",
        "author": "l`( ",
        "created": "+014697-02-02T20:12:04.692Z",
        "tag": "fox",
        "content": "?Ry\"Y5CO",
        "published": true
      },
      {
        "id": "|_wJ=/{rP",
        "author": "5j{*\"`L~",
        "created": "-000763-05-03T22:01:18.003Z",
        "tag": "pony",
        "content": "<,^<8v",
        "published": true
      },
      {
        "id": "3g,v",
        "author": "3",
        "created": "+158617-10-22T18:09:03.570Z",
        "tag": "fox",
        "content": "MKt\\D@<1d",
        "published": true
      },
      {
        "id": "&@-P:",
        "author": "o{/CsZ",
        "created": "-090627-02-01T01:52:45.085Z",
        "tag": "bunny",
        "content": "DL=Y",
        "published": false
      }
    ]
  },
  {
    "id": "bind",
    "article": [
      {
        "id": "!",
        "author": "=MP_=2\\0M",
        "created": "1970-01-01T00:00:00.045Z",
        "tag": "pony",
        "content": "",
        "published": true
      },
      {
        "id": "{s'+",
        "author": "%5{#Q9y\"8",
        "created": "-128929-10-24T23:19:39.271Z",
        "tag": "pony",
        "content": "to",
        "published": false
      },
      {
        "id": "O5[:Y",
        "author": ")tj^\\*=",
        "created": "-087446-08-04T09:19:28.489Z",
        "tag": "pony",
        "content": "f(:oY-%",
        "published": true
      }
    ]
  }
]
```

In this example, arbitrary will be a randomly generated array that satisfies the specified validation rules.

## Warning

### Tuple

**Tuple** validator only support primitive validator:

`unknown, string, number, boolean, null, undefined`

### Unsupported validators

Despicte my will to support the following validators (I asked the idonttrustlikethat author to make change to make it possible, but had no responses… 😪), they are not supported:

```
- discriminatedUnion
- and
- then
- recursion
- minSize
```

## Contributing

We welcome contributions to idonttrustlikethat-fast-check! Here's how you can help:

### Reporting Issues

If you find a bug or have a feature request:

1. Search the [issue tracker](https://github.com/nielk/idonttrustlikethat-fast-check/issues) to ensure it hasn't been reported before.
2. If not found, [open a new issue](https://github.com/nielk/idonttrustlikethat-fast-check/issues/new), providing as much detail as possible.

### Contributing Code

1. Fork the repository and create your branch from `main`.
2. Clone your fork and install dependencies:
   ```
   git clone https://github.com/your-username/idonttrustlikethat-fast-check.git
   cd idonttrustlikethat-fast-check
   pnpm install
   ```
3. Make your changes, adding tests for new functionality.
4. Ensure all tests pass:
   ```
   pnpm run test
   ```
5. Run the build process:
   ```
   pnpm run build
   ```
6. Commit your changes using a descriptive commit message.
7. Push to your fork and [submit a pull request](https://github.com/nielk/idonttrustlikethat-fast-check/compare).

### Code Style

- Follow the existing code style.
- Use meaningful variable names and add comments for complex logic.
- Write clear commit messages.

### Running Tests

To run the test suite:

```
pnpm run test
```

For coverage report:

```
pnpm run coverage
```

### Documentation

Improvements to documentation are always welcome. This includes:

- README.md updates
- Code comments
- Examples in the `examples/` directory

### Questions?

Feel free to open an issue for any questions about contributing.

Thank you for contributing to idonttrustlikethat-fast-check!

# License

This project is licensed under the MIT License - see the LICENSE file for details.
