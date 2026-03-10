# Version Pin Checklist

Migration: PHP 7.4→8.2, TypeScript 5.7→5.8, Node 20→22, @typescript-eslint 5→7

## 1. Node.js Version (^20.11.1 → ^22.0.0)

### .nvmrc
- [ ] `.nvmrc` (v20 → v22)

### package.json engines.node (36 files)
- [ ] `package.json`
- [ ] `packages/js/components/package.json`
- [ ] `packages/js/create-product-editor-block/package.json`
- [ ] `packages/js/create-woo-extension/package.json`
- [ ] `packages/js/csv-export/package.json`
- [ ] `packages/js/currency/package.json`
- [ ] `packages/js/customer-effort-score/package.json`
- [ ] `packages/js/data/package.json`
- [ ] `packages/js/date/package.json`
- [ ] `packages/js/dependency-extraction-webpack-plugin/package.json`
- [ ] `packages/js/e2e-utils-playwright/package.json`
- [ ] `packages/js/eslint-plugin/package.json`
- [ ] `packages/js/experimental/package.json`
- [ ] `packages/js/explat/package.json`
- [ ] `packages/js/expression-evaluation/package.json`
- [ ] `packages/js/extend-cart-checkout-block/package.json`
- [ ] `packages/js/internal-js-tests/package.json`
- [ ] `packages/js/internal-style-build/package.json`
- [ ] `packages/js/navigation/package.json`
- [ ] `packages/js/notices/package.json`
- [ ] `packages/js/number/package.json`
- [ ] `packages/js/onboarding/package.json`
- [ ] `packages/js/remote-logging/package.json`
- [ ] `packages/js/tracks/package.json`
- [ ] `plugins/woocommerce/client/admin/package.json`
- [ ] `plugins/woocommerce/client/blocks/bin/eslint-plugin-woocommerce/package.json`
- [ ] `plugins/woocommerce/client/blocks/package.json`
- [ ] `plugins/woocommerce/package.json`
- [ ] `plugins/woocommerce-beta-tester/package.json`
- [ ] `tools/code-analyzer/package.json`
- [ ] `tools/compare-perf/package.json`
- [ ] `tools/monorepo-merge/package.json`
- [ ] `tools/monorepo-utils/package.json`
- [ ] `tools/package-release/package.json`
- [ ] `tools/release-posts/package.json`
- [ ] `tools/storybook/package.json`

### @types/node (syncpackrc + package.json files, 20.x.x → 22.x.x)
- [ ] `.syncpackrc` (@types/node pinVersion)
- [ ] `package.json`
- [ ] `packages/js/e2e-utils-playwright/package.json`
- [ ] `packages/js/remote-logging/package.json`
- [ ] `packages/js/tracks/package.json`
- [ ] `tools/code-analyzer/package.json`
- [ ] `tools/compare-perf/package.json`
- [ ] `tools/monorepo-merge/package.json`
- [ ] `tools/monorepo-utils/package.json`
- [ ] `tools/package-release/package.json`
- [ ] `tools/release-posts/package.json`

## 2. TypeScript (5.7.x → 5.8.x)

### .syncpackrc
- [ ] `.syncpackrc` (typescript pinVersion) — managed by syncpack

### package.json devDependencies (39 files — will be handled by syncpack after .syncpackrc update)
- [ ] All 39 package.json files with "typescript": "5.7.x" → "5.8.x"

## 3. PHP Minimum Version (7.4 → 8.2)

### Plugin headers
- [ ] `plugins/woocommerce/readme.txt` (Requires PHP: 7.4 → 8.2)
- [ ] `plugins/woocommerce/woocommerce.php` (Requires PHP: 7.4 → 8.2)

### composer.json require.php (40 files)
- [ ] `plugins/woocommerce/composer.json`
- [ ] `plugins/woocommerce/lib/composer.json`
- [ ] `plugins/woocommerce/client/admin/composer.json`
- [ ] `plugins/woocommerce/bin/composer/phpunit/composer.json`
- [ ] `plugins/woocommerce/bin/composer/phpcs/composer.json`
- [ ] `plugins/woocommerce/bin/composer/wp/composer.json`
- [ ] `plugins/woocommerce/bin/composer/mozart/composer.json`
- [ ] `plugins/woocommerce-beta-tester/composer.json`
- [ ] `packages/php/email-editor/composer.json`
- [ ] `packages/php/email-editor/tasks/phpstan/composer.json`
- [ ] `packages/php/email-editor/vendor-prefixed/composer.json`
- [ ] `packages/js/dependency-extraction-webpack-plugin/composer.json`
- [ ] `packages/js/product-editor/composer.json`
- [ ] `packages/js/tracks/composer.json`
- [ ] `packages/js/expression-evaluation/composer.json`
- [ ] `packages/js/block-templates/composer.json`
- [ ] `packages/js/remote-logging/composer.json`
- [ ] `packages/js/notices/composer.json`
- [ ] `packages/js/e2e-utils-playwright/composer.json`
- [ ] `packages/js/onboarding/composer.json`
- [ ] `packages/js/create-woo-extension/composer.json`
- [ ] `packages/js/integrate-plugin/composer.json`
- [ ] `packages/js/experimental/composer.json`
- [ ] `packages/js/sanitize/composer.json`
- [ ] `packages/js/currency/composer.json`
- [ ] `packages/js/components/composer.json`
- [ ] `packages/js/customer-effort-score/composer.json`
- [ ] `packages/js/extend-cart-checkout-block/composer.json`
- [ ] `packages/js/internal-js-tests/composer.json`
- [ ] `packages/js/date/composer.json`
- [ ] `packages/js/settings-editor/composer.json`
- [ ] `packages/js/navigation/composer.json`
- [ ] `packages/js/csv-export/composer.json`
- [ ] `packages/js/data/composer.json`
- [ ] `packages/js/number/composer.json`
- [ ] `packages/js/create-product-editor-block/composer.json`
- [ ] `packages/js/email-editor/composer.json`
- [ ] `packages/js/explat/composer.json`
- [ ] `packages/js/admin-layout/composer.json`
- [ ] `packages/js/eslint-plugin/composer.json`

### phpstan.neon (phpVersion: 70400 → 80200)
- [ ] `plugins/woocommerce/phpstan.neon`
- [ ] `packages/php/email-editor/tasks/phpstan/phpstan-7.neon`

### .wp-env.json (phpVersion: 8.1 → 8.5 for runtime)
- [ ] `plugins/woocommerce/.wp-env.json` (8.1 → 8.5)
- [ ] `plugins/woocommerce/client/blocks/.wp-env.json` (7.4 → 8.5)
- [ ] `packages/php/blueprint/.wp-env.json` (8.1 → 8.5)
- [ ] `packages/php/email-editor/.wp-env.json` (8.1 → 8.5)
- [ ] `plugins/woocommerce-beta-tester/.wp-env.json` (8.1 → 8.5)

### CI matrix entries (package.json phpVersion)
- [ ] `plugins/woocommerce/package.json` — Remove PHP 7.4 test entries, add PHP 8.2
- [ ] `packages/php/email-editor/package.json` — Update phpVersion entries if applicable

### phpcs.xml
- [ ] `plugins/woocommerce/phpcs.xml` — Check testVersion attribute
- [ ] `phpcs.xml` (root) — Check testVersion attribute

## 4. @typescript-eslint (^5.62.0 → ^7.0.0)

### package.json devDependencies
- [ ] `packages/js/eslint-plugin/package.json` (@typescript-eslint/eslint-plugin, @typescript-eslint/parser)
- [ ] `plugins/woocommerce/client/admin/package.json` (@typescript-eslint/eslint-plugin, @typescript-eslint/parser)
- [ ] `plugins/woocommerce/client/blocks/package.json` (@typescript-eslint/eslint-plugin, @typescript-eslint/parser)
- [ ] `plugins/woocommerce/package.json` (@typescript-eslint/eslint-plugin, @typescript-eslint/parser, @typescript-eslint/experimental-utils → @typescript-eslint/utils)

### .syncpackrc
- [ ] `.syncpackrc` — Update @typescript-eslint/** version management

## 5. Deprecated API Replacements

### utf8_encode() / utf8_decode() removal (PHP 8.2)
- [ ] Search and replace with mb_convert_encoding() — **NOTE: No occurrences found in PHP source**

### @typescript-eslint/experimental-utils → @typescript-eslint/utils
- [ ] `plugins/woocommerce/package.json` — Replace package reference

## 6. Other Related Files

### Dockerfile
- [ ] `plugins/woocommerce/client/blocks/bin/docker/wp-cli/Dockerfile` — Check PHP version references
