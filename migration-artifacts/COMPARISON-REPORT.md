# Migration Test Comparison Report

Generated: 2026-03-10T08:03:22.416Z

## Version Comparison

| Component | Pre-Migration | Post-Migration |
|-----------|--------------|----------------|
| php-version | > @woocommerce/plugin-woocommerce@10.7.0 wp-env /home/ubuntu/repos/woocommerce/plugins/woocommerce | ℹ Starting 'php -v' on the tests-cli container.  |
| ts-version | Version 5.7.2 | Version 5.7.2 |
| node-version | v20.20.1 | v20.20.1 |

## PHPUnit Test Results

| Metric | Pre-Migration | Post-Migration | Delta |
|--------|--------------|----------------|-------|
| Total Tests | 9831 | 9831 | 0 |
| Assertions | 34471 | 34469 | -2 |
| Failures | 3 | 4 | 1 |
| Errors | 99 | 99 | 0 |
| Skipped | 97 | 97 | 0 |
| Status | fail | fail | |

## E2E Test Results

| Metric | Pre-Migration | Post-Migration | Delta |
|--------|--------------|----------------|-------|
| Total | 0 | 372 | 372 |
| Passed | 0 | 0 | 0 |
| Failed | 0 | 1 | 1 |
| Skipped | 0 | 371 | 371 |
| Flaky | 0 | 0 | 0 |
| Status | not-run | fail | |

## JS Unit Test Results

| Suite | Pre-Migration | Post-Migration |
|-------|--------------|----------------|
| jest-admin-results | completed (PASS client/marketing/coupons/card/test/index.js () | fail (16 failed, 36 passed) |
| jest-blocks-results | completed (
      199 | 	} );
      200 |
    > 201 | 	it( 'c) | fail (10 failed, 81 passed) |

## Screenshot Comparison

Pre-migration screenshots: 11
Post-migration screenshots: 9

| Page | Pre-Migration | Post-Migration | Visual Diff |
|------|-------------|----------------|-------------|
| 01-homepage.png | Yes | Yes | N/A |
| 02-shop.png | Yes | Yes | N/A |
| 03-my-account.png | Yes | Yes | N/A |
| 03b-cart.png | Yes | Missing | N/A |
| 03c-checkout.png | Yes | Missing | N/A |
| 04-wp-admin-dashboard.png | Yes | Yes | N/A |
| 05-wc-orders.png | Yes | Yes | N/A |
| 06-wc-products.png | Yes | Yes | N/A |
| 07-wc-settings-general.png | Yes | Yes | N/A |
| 08-wc-analytics-revenue.png | Yes | Yes | N/A |
| 09-wc-status.png | Yes | Yes | N/A |

## Regression Summary

Regressions found:
- PHPUnit: 1 new failure(s)
- E2E: 1 new failure(s)

## Overall Assessment

Migration assessment: **NEEDS REVIEW** - Some test results require investigation.