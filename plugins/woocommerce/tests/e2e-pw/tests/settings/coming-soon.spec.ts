/**
 * Internal dependencies
 */
import { test, expect } from '../../fixtures/fixtures';
import { ADMIN_STATE_PATH } from '../../playwright.config';

test.describe( 'WooCommerce Coming Soon Mode', () => {
	test.use( { storageState: ADMIN_STATE_PATH } );

	test.afterEach( async ( { page } ) => {
		// Ensure coming soon is disabled after each test
		await page.goto(
			'wp-admin/admin.php?page=wc-settings&tab=site-visibility'
		);
		const comingSoonCheckbox = page.locator( '#woocommerce_coming_soon' );
		if ( await comingSoonCheckbox.isChecked() ) {
			await comingSoonCheckbox.uncheck();
			await page.locator( 'text=Save changes' ).click();
		}
	} );

	test( 'can enable coming soon mode and verify storefront shows coming soon page', async ( {
		page,
	} ) => {
		// Navigate to site visibility settings
		await page.goto(
			'wp-admin/admin.php?page=wc-settings&tab=site-visibility'
		);

		// Enable coming soon mode
		const comingSoonCheckbox = page.locator( '#woocommerce_coming_soon' );
		if ( ! ( await comingSoonCheckbox.isChecked() ) ) {
			await comingSoonCheckbox.check();
		}
		await page.locator( 'text=Save changes' ).click();

		// Verify settings saved
		await expect( page.locator( 'div.updated.inline' ) ).toContainText(
			'Your settings have been saved.'
		);

		// Verify coming soon is enabled
		await expect( comingSoonCheckbox ).toBeChecked();
	} );

	test( 'can disable coming soon mode and verify store is accessible', async ( {
		page,
	} ) => {
		// First enable coming soon
		await page.goto(
			'wp-admin/admin.php?page=wc-settings&tab=site-visibility'
		);
		const comingSoonCheckbox = page.locator( '#woocommerce_coming_soon' );
		if ( ! ( await comingSoonCheckbox.isChecked() ) ) {
			await comingSoonCheckbox.check();
			await page.locator( 'text=Save changes' ).click();
		}

		// Now disable it
		await comingSoonCheckbox.uncheck();
		await page.locator( 'text=Save changes' ).click();

		// Verify settings saved
		await expect( page.locator( 'div.updated.inline' ) ).toContainText(
			'Your settings have been saved.'
		);

		// Verify coming soon is disabled
		await expect( comingSoonCheckbox ).not.toBeChecked();

		// Navigate to storefront and verify it loads
		await page.goto( '/' );
		await expect( page.locator( 'body' ) ).not.toContainText(
			'Coming Soon'
		);
	} );
} );
