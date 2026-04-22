# @liftivity/config

Shared TypeScript and ESLint configuration for the monorepo.

## Usage in a package's `tsconfig.json`

```json
{
  "extends": "@liftivity/config/tsconfig"
}
```

## Usage in a package's `.eslintrc.js`

```js
module.exports = {
  extends: [require.resolve("@liftivity/config/eslint")],
};
```
