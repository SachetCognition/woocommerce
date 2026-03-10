/**
 * Internal dependencies
 */
import { test, expect } from '../../fixtures/fixtures';
import { ADMIN_STATE_PATH } from '../../playwright.config';

test.describe( 'WooCommerce Product Import/Export UI', () => {
	test.use( { storageState: ADMIN_STATE_PATH } );

	test( 'can navigate to product import page', async ( { page } ) => {
		await page.goto(
			'wp-admin/edit.php?post_type=product&page=product_importer'
		);

		// Verify the import page loads
		await expect(
			page.locator( '.wc-progress-steps' )
		).toBeVisible();
		await expect( page.locator( 'h2' ) ).toContainText(
			'Import products from a CSV file'
		);

		// Verify the file upload input is present
		await expect( page.locator( '#upload' ) ).toBeVisible();
	} );

	test( 'can navigate to product export page', async ( { page } ) => {
		await page.goto(
			'wp-admin/edit.php?post_type=product&page=product_exporter'
		);

		// Verify the export page loads
		await expect(
			page.locator( '.woocommerce-exporter' )
		).toBeVisible();

		// Verify columns selection is present
		await expect(
			page.locator( '#woocommerce-exporter-columns' )
		).toBeVisible();

		// Verify the export button is present
		await expect(
			page.locator( 'button:has-text("Generate CSV")' )
		).toBeVisible();
	} );

	test( 'can select export columns and product types', async ( {
		page,
	} ) => {
		await page.goto(
			'wp-admin/edit.php?post_type=product&page=product_exporter'
		);

		// Verify column checkboxes are present
		await expect(
			page.locator( '.woocommerce-exporter-columns' )
		).toBeVisible();

		// Verify product type filter is present
		await expect(
			page.locator( '#woocommerce-exporter-types' )
		).toBeVisible();
	} );
} );
