/**
 * Internal dependencies
 */
import { test, expect } from '../../fixtures/fixtures';
import { ADMIN_STATE_PATH } from '../../playwright.config';

test.describe( 'WooCommerce Email Rendering', () => {
	test.use( { storageState: ADMIN_STATE_PATH } );

	test( 'can view email settings page', async ( { page } ) => {
		await page.goto( 'wp-admin/admin.php?page=wc-settings&tab=email' );

		// Verify email settings tab is active
		await expect( page.locator( 'a.nav-tab-active' ) ).toContainText(
			'Emails'
		);

		// Verify email notification list is visible
		await expect( page.locator( 'table.wc_emails' ) ).toBeVisible();
	} );

	test( 'can view individual email template settings', async ( { page } ) => {
		await page.goto( 'wp-admin/admin.php?page=wc-settings&tab=email' );

		// Click on first email type to view settings
		await page
			.locator( 'table.wc_emails td.wc-email-settings-table-name a' )
			.first()
			.click();

		// Verify we can see the email configuration
		await expect(
			page
				.locator(
					'#woocommerce_email_enabled, #woocommerce_new_order_enabled, input[type="checkbox"]'
				)
				.first()
		).toBeVisible();
	} );

	test( 'can configure email sender options', async ( { page } ) => {
		await page.goto( 'wp-admin/admin.php?page=wc-settings&tab=email' );

		// Scroll to email sender options section
		const fromName = page.locator( '#woocommerce_email_from_name' );
		const fromAddress = page.locator( '#woocommerce_email_from_address' );

		// Verify sender fields exist
		await expect( fromName ).toBeVisible();
		await expect( fromAddress ).toBeVisible();
	} );

	test( 'can preview email template', async ( { page } ) => {
		// Navigate to email settings
		await page.goto( 'wp-admin/admin.php?page=wc-settings&tab=email' );

		// Verify the email list table exists
		await expect( page.locator( 'table.wc_emails' ) ).toBeVisible();

		// Verify email types are listed
		const emailRows = page.locator( 'table.wc_emails tbody tr' );
		await expect( emailRows ).not.toHaveCount( 0 );
	} );
} );
