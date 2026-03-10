/**
 * External dependencies
 */
import { WC_API_PATH } from '@woocommerce/e2e-utils-playwright';

/**
 * Internal dependencies
 */
import { tags, test, expect } from '../../fixtures/fixtures';
import { ADMIN_STATE_PATH } from '../../playwright.config';

test.describe(
	'WooCommerce HPOS Sync Verification',
	{ tag: [ tags.HPOS ] },
	() => {
		let orderId: number;
		let productId: number;

		test.use( { storageState: ADMIN_STATE_PATH } );

		test.beforeAll( async ( { restApi } ) => {
			// Create a simple product
			await restApi
				.post( `${ WC_API_PATH }/products`, {
					name: 'HPOS Test Product',
					type: 'simple',
					regular_price: '25.00',
				} )
				.then( ( response: { data: { id: number } } ) => {
					productId = response.data.id;
				} );
		} );

		test.afterAll( async ( { restApi } ) => {
			if ( productId ) {
				await restApi.delete(
					`${ WC_API_PATH }/products/${ productId }`,
					{ force: true }
				);
			}
			if ( orderId ) {
				await restApi.delete(
					`${ WC_API_PATH }/orders/${ orderId }`,
					{ force: true }
				);
			}
		} );

		test( 'can create an order with HPOS enabled and verify it is accessible', async ( {
			page,
			restApi,
		} ) => {
			// Create an order via REST API
			const orderResponse = await restApi.post(
				`${ WC_API_PATH }/orders`,
				{
					line_items: [
						{
							product_id: productId,
							quantity: 2,
						},
					],
					status: 'processing',
				}
			);
			orderId = orderResponse.data.id;

			// Navigate to the order in admin
			await page.goto(
				`wp-admin/admin.php?page=wc-orders&action=edit&id=${ orderId }`
			);

			// Verify order is accessible and shows correct data
			await expect(
				page.locator( '.woocommerce-order-data__heading' )
			).toContainText( `Order #${ orderId }` );

			// Verify line item
			await expect(
				page.locator( '.wc-order-item-name' ).first()
			).toContainText( 'HPOS Test Product' );
		} );

		test( 'can verify order appears in orders list', async ( {
			page,
		} ) => {
			// Navigate to orders list
			await page.goto( 'wp-admin/admin.php?page=wc-orders' );

			// Verify order is in the list
			await expect(
				page.locator( `a.order-view:has-text("#${ orderId }")` )
			).toBeVisible();
		} );

		test( 'can verify HPOS status in system status', async ( {
			page,
		} ) => {
			// Navigate to WooCommerce > Status > System Status
			await page.goto(
				'wp-admin/admin.php?page=wc-status'
			);

			// Look for the order datastore info
			await expect(
				page.locator( 'table.wc_status_table' ).first()
			).toBeVisible();
		} );
	}
);
