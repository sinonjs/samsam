# Changes

## 8.0.3

- [`630f2ae`](https://github.com/sinonjs/samsam/commit/630f2ae2deed0409b91364431a82b52a63cb46eb)
  Bump elliptic from 6.5.7 to 6.6.1 (#258) (dependabot[bot])
    >
    > Bumps [elliptic](https://github.com/indutny/elliptic) from 6.5.7 to 6.6.1.
    > - [Commits](https://github.com/indutny/elliptic/compare/v6.5.7...v6.6.1)
    >
    > ---
    > updated-dependencies:
    > - dependency-name: elliptic
    >   dependency-version: 6.6.1
    >   dependency-type: indirect
    > ...
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`dd18c1c`](https://github.com/sinonjs/samsam/commit/dd18c1ccb9bcf00bc33316a2f3706cc32c3c1cc5)
  Remove deprecated lodash.get (#254) (Yashar Fakhari)
    >
    > We need slightly more than a direct substitution of `.get()` with `?.` because `?.` handles individual properties and hasNested function needs to handle nested paths which are not single properties.
    >
    > To handle nested paths, the regex is breaking the property string into its individual components and removes empty values.  The loop traverses the object, moving one level deeper for each part of the path so we can safely access the next property (part) of the current object (`current = current?.[part]`).  This handles cases where any intermediate property might be `undefined` or `null`.  If `current` becomes `undefined` at any point we know the path doesn't exist, so we can immediately return `false`.  After the loop is finished then the value of `current` is the value we want to get.

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2025-07-25._

## 8.0.2

- [`631d739`](https://github.com/sinonjs/samsam/commit/631d73979cdceff930b05ce9d4b8ae21d6732b20)
  Fix low-hanging 'npm audit' fruits (Carl-Erik Kopseng)
- [`a3cdefa`](https://github.com/sinonjs/samsam/commit/a3cdefa75148838c7c720379711734835e964352)
  Bump elliptic from 6.5.4 to 6.5.7 (#248) (dependabot[bot])
    > Signed-off-by: dependabot[bot] <support@github.com>    >
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`47e4b73`](https://github.com/sinonjs/samsam/commit/47e4b73beaac88b70a4613d9d3f7996b52792d22)
  Bump browserify-sign from 4.2.1 to 4.2.3 (#249) (dependabot[bot])
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-12._

## 8.0.1

- [`ca41112`](https://github.com/sinonjs/samsam/commit/ca41112f977bf24a365e96c9d7993b358fb37721)
  Update all dependencies (#247) (Carl-Erik Kopseng)

- [`153c0a7`](https://github.com/sinonjs/samsam/commit/153c0a769edc50d80aa1e56bbc7953d01a4e4045)
  Fix matcher cyclic object infinite recursion issue (#245) (Phil Spitzer)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2024-09-12._

## 8.0.0

- [`5f88086`](https://github.com/sinonjs/samsam/commit/5f88086df8aef2d427a9ccca588df2498738b654)
  fix: ensure nothing can mutate the exported 'message' (Carl-Erik Kopseng)

_Released by [Carl-Erik Kopseng](https://github.com/fatso83) on 2023-03-26._

## 7.0.1

- [`fb6573a`](https://github.com/sinonjs/samsam/commit/fb6573a68f4408616fc6f93a6aca377c7c163bf2)
  Prefer @sinonjs/commons@2 (Morgan Roderick)
    >
    > That makes ES2017 support explicit
    >

_Released by Morgan Roderick on 2022-11-07._

## 7.0.0

- [`85a9acb`](https://github.com/sinonjs/samsam/commit/85a9acb772ab7739a597052c7ba8e21006c74b94)
  Stop testing in Node 12, start testing in Node 18, 19 (Morgan Roderick)

_Released by Morgan Roderick on 2022-11-02._

## 6.1.3

- [`15295d9`](https://github.com/sinonjs/samsam/commit/15295d93358708dc61efe7348e43e968feb56723)
  Fix #237: Use jQuery#is() for jQuery equality (Morgan Roderick)
    >
    > In f1a1f306018166ad76ab1a1a71d400fc9373f7d0 we added support for
    > [Javascript iteraction protocols][0].
    >
    > jQuery objects happen to have iteration protocols, so they would trigger
    > the new codepath. However, that code path uses `Array.from` on the
    > input, which doesn't play nice with jQuery's serializer.
    >
    > Luckily, [jQuery has the `is()` method for comparing its objects][1].
    >
    > [0]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
    > [1]: https://api.jquery.com/is/
    >

_Released by Morgan Roderick on 2022-11-02._

## 6.1.2

- [`aa3badb`](https://github.com/sinonjs/samsam/commit/aa3badb23f6e415635c6f96f95dc2c807a1b5f09)
  Fix to compare input for iteratables. (#229) (Shuhei Aoyama)
- [`58480cc`](https://github.com/sinonjs/samsam/commit/58480ccce764d0eb247f38e395c5638cc1183b9c)
  npm audit fix (Morgan Roderick)
- [`1b9c378`](https://github.com/sinonjs/samsam/commit/1b9c37837d8d2126558bc8e55f910c0b025fd6a6)
  Upgrade benchmark and microtime to latest (Morgan Roderick)
- [`3d6e322`](https://github.com/sinonjs/samsam/commit/3d6e3223fc306a789e8e7081aba57e192f4d9988)
  Remove unused mkdirp dependency (Morgan Roderick)
- [`4388ea7`](https://github.com/sinonjs/samsam/commit/4388ea7e1b131fb96184b25ef96eaee1637061f2)
  Upgrade typescript to latest (Morgan Roderick)
- [`4e29ee0`](https://github.com/sinonjs/samsam/commit/4e29ee0e8178456e7a22b766feb98a22042fe808)
  Upgrade prettier to latest (Morgan Roderick)
- [`f2c548e`](https://github.com/sinonjs/samsam/commit/f2c548efea9ff0a4a3afadfded1f3dafd651bf1e)
  Upgrade nyc to latest (Morgan Roderick)
- [`3bda5a3`](https://github.com/sinonjs/samsam/commit/3bda5a30a46ebcfd9c1d2da358d8968b9d357dd3)
  Upgrade mochify to latest (Morgan Roderick)
- [`30ac30b`](https://github.com/sinonjs/samsam/commit/30ac30bc9734ce1d610568af40e639f85fba088c)
  Upgrade mocha to latest (Morgan Roderick)
- [`fd9aa60`](https://github.com/sinonjs/samsam/commit/fd9aa60b12e271b94a536f61e95255fbc97eeacf)
  Upgrade jsdoc to latest (Morgan Roderick)
- [`501fef7`](https://github.com/sinonjs/samsam/commit/501fef7e43f3de5b4311a9cda5921b7b78e1f9ee)
  Upgrade husky to latest (Morgan Roderick)
    >
    > See:
    >
    > * https://typicode.github.io/husky/#/?id=migrate-from-v4-to-v8
    > * https://github.com/typicode/husky-4-to-8
    >
- [`10857c2`](https://github.com/sinonjs/samsam/commit/10857c280f5d45bee37438553419010acfc5835b)
  Upgrade @studio/changes to latest (Morgan Roderick)
- [`c31f564`](https://github.com/sinonjs/samsam/commit/c31f564f96e5ea0e87e857f868d74fdad176a9c8)
  Upgrade @sinonjs/eslint-config to latest (Morgan Roderick)
- [`08ed814`](https://github.com/sinonjs/samsam/commit/08ed81491683caa904e837053d71cfe7072fe92f)
  Upgrade @sinonjs/referee to latest (Morgan Roderick)
- [`a16c58b`](https://github.com/sinonjs/samsam/commit/a16c58bf024fb66c114113e7d341ad7ac09f4331)
  Bump jsdom from 16.2.2 to 16.5.0 (dependabot[bot])
    >
    > Bumps [jsdom](https://github.com/jsdom/jsdom) from 16.2.2 to 16.5.0.
    > - [Release notes](https://github.com/jsdom/jsdom/releases)
    > - [Changelog](https://github.com/jsdom/jsdom/blob/master/Changelog.md)
    > - [Commits](https://github.com/jsdom/jsdom/compare/16.2.2...16.5.0)
    >
    > ---
    > updated-dependencies:
    > - dependency-name: jsdom
    >   dependency-type: direct:development
    > ...
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
- [`8b7d7de`](https://github.com/sinonjs/samsam/commit/8b7d7de1ab1af1deb9288ee00de6ecf7054bc85c)
  Bump shell-quote from 1.6.1 to 1.7.3 (dependabot[bot])
    >
    > Bumps [shell-quote](https://github.com/substack/node-shell-quote) from 1.6.1 to 1.7.3.
    > - [Release notes](https://github.com/substack/node-shell-quote/releases)
    > - [Changelog](https://github.com/substack/node-shell-quote/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/substack/node-shell-quote/compare/1.6.1...1.7.3)
    >
    > ---
    > updated-dependencies:
    > - dependency-name: shell-quote
    >   dependency-type: indirect
    > ...
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
- [`409866f`](https://github.com/sinonjs/samsam/commit/409866f2b14ecafe2baa94752f8c0d8496128409)
  chore: Set permissions for GitHub actions (Morgan Roderick)
    >
    > Restrict the GitHub token permissions only to the required ones; this
    > way, even if the attackers will succeed in compromising your workflow,
    > they won’t be able to do much.
    >
    > Included permissions for the action. https://github.com/ossf/scorecard/blob/main/docs/checks.md#token-permissions
    > https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions
    >
    > https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs
    >
    > Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests
    >
    > See sinonjs/sinon#2461
    >
- [`5a7317f`](https://github.com/sinonjs/samsam/commit/5a7317f9ec84ac85b4465541caa3102d107fc9c3)
  Update README (Morgan Roderick)
    >
    > The default branch was renamed
    >
- [`4354403`](https://github.com/sinonjs/samsam/commit/4354403b0b016ab4a4d973e7027eb3ffcce6cda7)
  Verify lockfileVersion (Morgan Roderick)
- [`be7df9e`](https://github.com/sinonjs/samsam/commit/be7df9ea82130bdde4b0009df64d26a20bd3aca7)
  Merge prettier, lint into static-analysis (Morgan Roderick)
- [`2e1bf94`](https://github.com/sinonjs/samsam/commit/2e1bf94dd885a277a199b80da9463b2a41bd58f5)
  Upgrade mocha to latest (Morgan Roderick)
- [`3bab205`](https://github.com/sinonjs/samsam/commit/3bab205592974a9d63bcc8275ebcc9e8f0a59f6f)
  Bump hosted-git-info from 3.0.4 to 3.0.8 (dependabot[bot])
    >
    > Bumps [hosted-git-info](https://github.com/npm/hosted-git-info) from 3.0.4 to 3.0.8.
    > - [Release notes](https://github.com/npm/hosted-git-info/releases)
    > - [Changelog](https://github.com/npm/hosted-git-info/blob/main/CHANGELOG.md)
    > - [Commits](https://github.com/npm/hosted-git-info/compare/v3.0.4...v3.0.8)
    >
    > ---
    > updated-dependencies:
    > - dependency-name: hosted-git-info
    >   dependency-type: indirect
    > ...
    >
    > Signed-off-by: dependabot[bot] <support@github.com>
- [`14d3637`](https://github.com/sinonjs/samsam/commit/14d36378703d291ad08aa43a676fe90b40f0676f)
  Bump ajv from 6.10.2 to 6.12.6 (dependabot[bot])
    >
    > Bumps [ajv](https://github.com/ajv-validator/ajv) from 6.10.2 to 6.12.6.
    > - [Release notes](https://github.com/ajv-validator/ajv/releases)
    > - [Commits](https://github.com/ajv-validator/ajv/compare/v6.10.2...v6.12.6)
    >
    > ---
    > updated-dependencies:
    > - dependency-name: ajv
    >   dependency-type: indirect
    > ...
    >
    > Signed-off-by: dependabot[bot] <support@github.com>

_Released by Morgan Roderick on 2022-10-31._

## 6.1.1

- [`0a89fbd`](https://github.com/sinonjs/samsam/commit/0a89fbd6e186a7343a6369e924457e2fa14df710)
  Bump cached-path-relative from 1.0.2 to 1.1.0 (#227) (dependabot[bot])
    > Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
- [`88a3fca`](https://github.com/sinonjs/samsam/commit/88a3fca262b3a4bc29b53635bb8ec5c2a3925a5b)
  Install missing dependency mkdocs and update lock file version (Carl-Erik Kopseng)

_Released on 2022-01-28._

## 6.1.0

- [`6955f94`](https://github.com/sinonjs/samsam/commit/6955f94b414049f21971c19a0f97c1b5f922126f)
  fix (#226) (Stuart Dotson)
- [`f1a1f30`](https://github.com/sinonjs/samsam/commit/f1a1f306018166ad76ab1a1a71d400fc9373f7d0)
  add support for iterables (#225) (Stuart Dotson)
- [`2bc9f80`](https://github.com/sinonjs/samsam/commit/2bc9f80ab886653f4995c60b09af93e0216a9724)
  Bump path-parse from 1.0.6 to 1.0.7 (dependabot[bot])
- [`64dfb5d`](https://github.com/sinonjs/samsam/commit/64dfb5d1f477033b5e5a3b7e037e921048ddef5e)
  Bump ws from 6.2.1 to 6.2.2 (dependabot[bot])
- [`d41050b`](https://github.com/sinonjs/samsam/commit/d41050be94d214b15a2cecb18cc0c36d6141fd82)
  Bump browserslist from 4.16.3 to 4.16.6 (dependabot[bot])

_Released on 2022-01-27._

## 6.0.2

- [`144204d`](https://github.com/sinonjs/samsam/commit/144204d505526d5c382cb2f3dc2c2dd1378fe12d)
  Fix deep equal comparison between promises (#217) (David G. Miguel)

_Released on 2021-05-24._

## 6.0.1

- [`decfafe`](https://github.com/sinonjs/samsam/commit/decfafe72d8b2d159cfc49440a8f4af6d3e9c574)
  Bump y18n from 4.0.0 to 4.0.1 (dependabot[bot])
    >
    > Bumps [y18n](https://github.com/yargs/y18n) from 4.0.0 to 4.0.1.
    > - [Release notes](https://github.com/yargs/y18n/releases)
    > - [Changelog](https://github.com/yargs/y18n/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/yargs/y18n/commits)
    >
    > Signed-off-by: dependabot[bot] <support@github.com>

_Released on 2021-04-08._

## 6.0.0

- [`95d1dce`](https://github.com/sinonjs/samsam/commit/95d1dce07f47b7bbb84111c42f44ecd9466dc2c8)
  Use @sinonjs/eslint-config (Morgan Roderick)
    >
    > This drops support for legacy runtimes like IE11, legacy Edge, Safari 9 and the like

_Released on 2021-03-30._

## 5.3.1

- [`04e0faa`](https://github.com/sinonjs/samsam/commit/04e0faa88d8a08325c6d70febed9dad4e7eeabfe)
  Distribute package as source (Morgan Roderick)
    >
    > This library is not meant for writing end user applications or even for
    > being used directly when writing tests. It is not meant to be loaded
    > directly by browsers.
    >
    > Consumers of this package are assumed to use their own bundlers, should
    > they need to bundle code for use in browsers or workers.
    >
    > Therefore, it is safe to distribute the package as source files and not
    > bundle them up.
    >
    > This allows us to remove the bundler and its transitive dependencies,
    > which reduces the maintenance burden of managing the library.
    >

_Released on 2021-01-13._

## 5.3.0

- [`fd8aabd`](https://github.com/sinonjs/samsam/commit/fd8aabd3768c199abc717dc6d793ef136419be72)
  Generate .d.ts from JSDoc (Morgan Roderick)
    >
    > See https://humanwhocodes.com/snippets/2020/10/create-typescript-declarations-from-javascript-jsdoc/
    >

_Released on 2020-11-16._

## 5.2.0

- [`f27b87c`](https://github.com/sinonjs/samsam/commit/f27b87cbd493a09e4a3181cf36f503facbbb23fb)
  Add match.json (Maximilian Antoni)

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-10-06._

## 5.1.0

- [`820c296`](https://github.com/sinonjs/samsam/commit/820c2961f70208367e1c072ae9a581eefd0d8d18)
  Evaluate symbol keys for object matchers (#206) (Joel Bradshaw)
    >
    > * Make match() work for objects with symbol keys

_Released on 2020-08-11._

## 5.0.3

- [`9d2add0`](https://github.com/sinonjs/samsam/commit/9d2add01eba85eb17ddb91ac22404fb6c23e8d39)
  Remove unused @sinonjs/formatio (Morgan Roderick)
    >
    > As can be seen with searching the codebase, @sinonjs/formatio is never
    > imported, and is thus not a direct dependency of @sinonjs/samsam.
    >

_Released on 2020-02-28._

## 5.0.2

- [`f9e845a`](https://github.com/sinonjs/samsam/commit/f9e845a52ba50916df91335d2003a81a808a4ade)
  Bump formatio to latest major (Morgan Roderick)
    >
    > This will remove some duplication in Sinon, see https://github.com/sinonjs/sinon/issues/2224
    >

_Released on 2020-02-20._

## 5.0.1

- [`fe5d035`](https://github.com/sinonjs/samsam/commit/fe5d03532ea6cdbec857c49d18392d668cca8ef2)
  Bump jsdom from 15.2.1 to 16.2.0 (dependabot-preview[bot])
    >
    > Bumps [jsdom](https://github.com/jsdom/jsdom) from 15.2.1 to 16.2.0.
    > - [Release notes](https://github.com/jsdom/jsdom/releases)
    > - [Changelog](https://github.com/jsdom/jsdom/blob/master/Changelog.md)
    > - [Commits](https://github.com/jsdom/jsdom/compare/15.2.1...16.2.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`910af18`](https://github.com/sinonjs/samsam/commit/910af18be1bd57c6237399ca04cbef91d994a38a)
  Remove maintenance junk from CHANGES.md (Morgan Roderick)

_Released on 2020-02-18._

## 5.0.0

- [`f288430`](https://github.com/sinonjs/samsam/commit/f2884309c9bf68b02ecfda3bd1df8d7a7a31686b)
  Drop support for Node 8 (Morgan Roderick)
    >
    > As can be seen at https://github.com/nodejs/Release, Node 8 reached
    > "end" of life on 2019-12-31, and is no longer actively supported.
    >
    > We will stop testing in Node 8 and start testing in Node 13, which will
    > become the next LTS release from April 2020.
    >

_Released on 2020-02-18._

## 4.2.2

- [`c600d6c`](https://github.com/sinonjs/samsam/commit/c600d6cb6c1bec8d65bc718bd9268311204597bc)
  Fix issue with nested array matching (Jay Merrifield)
- [`8b37566`](https://github.com/sinonjs/samsam/commit/8b37566ea73bee512fbc4203c07678288f906bda)
  Bump eslint from 6.7.2 to 6.8.0 (dependabot-preview[bot])
    >
    > Bumps [eslint](https://github.com/eslint/eslint) from 6.7.2 to 6.8.0.
    > - [Release notes](https://github.com/eslint/eslint/releases)
    > - [Changelog](https://github.com/eslint/eslint/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/eslint/eslint/compare/v6.7.2...v6.8.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`b7c5db9`](https://github.com/sinonjs/samsam/commit/b7c5db9e7847204188c112843bb193248d0b5156)
  Bump eslint-plugin-prettier from 3.1.1 to 3.1.2 (dependabot-preview[bot])
    >
    > Bumps [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) from 3.1.1 to 3.1.2.
    > - [Release notes](https://github.com/prettier/eslint-plugin-prettier/releases)
    > - [Changelog](https://github.com/prettier/eslint-plugin-prettier/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/prettier/eslint-plugin-prettier/compare/v3.1.1...v3.1.2)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`8965384`](https://github.com/sinonjs/samsam/commit/8965384818697b7b36537619922b3c378bfd0b42)
  Bump eslint-plugin-mocha from 6.1.1 to 6.2.2 (dependabot-preview[bot])
    >
    > Bumps [eslint-plugin-mocha](https://github.com/lo1tuma/eslint-plugin-mocha) from 6.1.1 to 6.2.2.
    > - [Release notes](https://github.com/lo1tuma/eslint-plugin-mocha/releases)
    > - [Changelog](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/lo1tuma/eslint-plugin-mocha/compare/6.1.1...6.2.2)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`8661610`](https://github.com/sinonjs/samsam/commit/866161044e212b4df56a207e55ab3e449346abf5)
  Bump eslint-config-prettier from 6.7.0 to 6.9.0 (dependabot-preview[bot])
    >
    > Bumps [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) from 6.7.0 to 6.9.0.
    > - [Release notes](https://github.com/prettier/eslint-config-prettier/releases)
    > - [Changelog](https://github.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/prettier/eslint-config-prettier/commits/v6.9.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`7d91124`](https://github.com/sinonjs/samsam/commit/7d91124a9fa95c462c1e714d86405d6cb99e3363)
  Bump rollup from 1.23.0 to 1.27.14 (dependabot-preview[bot])
    >
    > Bumps [rollup](https://github.com/rollup/rollup) from 1.23.0 to 1.27.14.
    > - [Release notes](https://github.com/rollup/rollup/releases)
    > - [Changelog](https://github.com/rollup/rollup/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/rollup/rollup/compare/v1.23.0...v1.27.14)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`31c616a`](https://github.com/sinonjs/samsam/commit/31c616ab278e05071138e18d6e5aea8f2c250c2a)
  Bump nyc from 14.1.1 to 15.0.0 (dependabot-preview[bot])
    >
    > Bumps [nyc](https://github.com/istanbuljs/nyc) from 14.1.1 to 15.0.0.
    > - [Release notes](https://github.com/istanbuljs/nyc/releases)
    > - [Changelog](https://github.com/istanbuljs/nyc/blob/master/CHANGELOG.md)
    > - [Commits](https://github.com/istanbuljs/nyc/compare/v14.1.1...v15.0.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`e82dbcf`](https://github.com/sinonjs/samsam/commit/e82dbcf9af6a052b1d466e476a7315e047324256)
  Bump @sinonjs/referee from 3.2.0 to 4.0.0 (dependabot-preview[bot])
    >
    > Bumps [@sinonjs/referee](https://github.com/sinonjs/referee) from 3.2.0 to 4.0.0.
    > - [Release notes](https://github.com/sinonjs/referee/releases)
    > - [Changelog](https://github.com/sinonjs/referee/blob/master/CHANGES.md)
    > - [Commits](https://github.com/sinonjs/referee/compare/v3.2.0...v4.0.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`b089354`](https://github.com/sinonjs/samsam/commit/b089354118a6f64139ca64906d8b8a9f282bc376)
  Bump eslint-plugin-jsdoc from 18.4.3 to 19.2.0 (dependabot-preview[bot])
    >
    > Bumps [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc) from 18.4.3 to 19.2.0.
    > - [Release notes](https://github.com/gajus/eslint-plugin-jsdoc/releases)
    > - [Commits](https://github.com/gajus/eslint-plugin-jsdoc/compare/v18.4.3...v19.2.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`bba8c44`](https://github.com/sinonjs/samsam/commit/bba8c441914cd3b07b505b4d917a042d16412c9e)
  Bump @sinonjs/commons from 1.6.0 to 1.7.0 (dependabot-preview[bot])
    >
    > Bumps [@sinonjs/commons](https://github.com/sinonjs/commons) from 1.6.0 to 1.7.0.
    > - [Release notes](https://github.com/sinonjs/commons/releases)
    > - [Commits](https://github.com/sinonjs/commons/compare/v1.6.0...v1.7.0)
    >
    > Signed-off-by: dependabot-preview[bot] <support@dependabot.com>
- [`5915960`](https://github.com/sinonjs/samsam/commit/5915960fab257e27564c544da45b419c360bc8fb)
  Publish using public access (Morgan Roderick)
- [`28ffc83`](https://github.com/sinonjs/samsam/commit/28ffc83556274b025d1fc62b52d2ff8ea25743a4)
  4.2.1 (Morgan Roderick)

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2020-01-09._

## 4.2.1

- [`8987966`](https://github.com/sinonjs/samsam/commit/898796645000b88f1a4045213355bed29085f46c)
  re-introduce bound deepEqual (#160) (James Garbutt)

_Released on 2019-12-30._
