/**
 * External dependencies
 */
import { WC_API_PATH } from '@woocommerce/e2e-utils-playwright';

/**
 * Internal dependencies
 */
import { test, expect } from '../../fixtures/fixtures';
import { ADMIN_STATE_PATH } from '../../playwright.config';

test.describe( 'WooCommerce Tax Calculation E2E', () => {
	let productId: number;
	let taxRateId: number;

	test.use( { storageState: ADMIN_STATE_PATH } );

	test.beforeAll( async ( { restApi } ) => {
		// Enable taxes
		await restApi.put(
			`${ WC_API_PATH }/settings/general/woocommerce_calc_taxes`,
			{ value: 'yes' }
		);

		// Create a tax rate
		const taxResponse = await restApi.post( `${ WC_API_PATH }/taxes`, {
			country: 'US',
			state: 'CA',
			rate: '10.0000',
			name: 'CA Tax',
			priority: 1,
			compound: false,
			shipping: true,
			class: 'standard',
		} );
		taxRateId = taxResponse.data.id;

		// Create a simple product
		const productResponse = await restApi.post(
			`${ WC_API_PATH }/products`,
			{
				name: 'Tax Test Product',
				type: 'simple',
				regular_price: '100.00',
			}
		);
		productId = productResponse.data.id;
	} );

	test.afterAll( async ( { restApi } ) => {
		// Cleanup
		if ( productId ) {
			await restApi.delete( `${ WC_API_PATH }/products/${ productId }`, {
				force: true,
			} );
		}
		if ( taxRateId ) {
			await restApi.delete( `${ WC_API_PATH }/taxes/${ taxRateId }`, {
				force: true,
			} );
		}
		// Disable taxes
		await restApi.put(
			`${ WC_API_PATH }/settings/general/woocommerce_calc_taxes`,
			{ value: 'no' }
		);
	} );

	test( 'can verify tax rate is created via API', async ( { restApi } ) => {
		const response = await restApi.get(
			`${ WC_API_PATH }/taxes/${ taxRateId }`
		);
		expect( response.data.rate ).toBe( '10.0000' );
		expect( response.data.name ).toBe( 'CA Tax' );
		expect( response.data.country ).toBe( 'US' );
		expect( response.data.state ).toBe( 'CA' );
	} );

	test( 'can verify tax rates page in admin', async ( { page } ) => {
		await page.goto(
			'wp-admin/admin.php?page=wc-settings&tab=tax&section=standard'
		);

		// Verify the tax rates table is visible
		await expect( page.locator( '#rates' ) ).toBeVisible();

		// Verify our tax rate is listed
		await expect( page.locator( 'input[value="CA Tax"]' ) ).toBeVisible();
	} );

	test( 'can add product to cart and verify tax is applied', async ( {
		page,
	} ) => {
		// Navigate to the product page
		await page.goto( `/?p=${ productId }` );

		// Add to cart
		await page.locator( 'button[name="add-to-cart"]' ).click();

		// Go to cart
		await page.goto( '/cart/' );

		// Verify the product is in the cart
		await expect(
			page.locator( '.cart_item .product-name' )
		).toContainText( 'Tax Test Product' );
	} );
} );
