const { chromium } = require( 'playwright' );
const path = require( 'path' );
const fs = require( 'fs' );

const BASE_URL = process.env.BASE_URL || 'http://localhost:8086';
const WP_ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const WP_ADMIN_PASS = process.env.WP_ADMIN_PASS || '';
const OUTPUT_DIR = process.argv[ 2 ] || path.resolve( __dirname, 'pre-migration/screenshots' );

async function captureScreenshots() {
	fs.mkdirSync( OUTPUT_DIR, { recursive: true } );

	const browser = await chromium.launch( { headless: true } );
	const context = await browser.newContext( {
		viewport: { width: 1280, height: 1024 },
		ignoreHTTPSErrors: true,
	} );

	// Login to admin
	const loginPage = await context.newPage();
	await loginPage.goto( `${ BASE_URL }/wp-login.php` );
	await loginPage.fill( '#user_login', WP_ADMIN_USER );
	await loginPage.fill( '#user_pass', WP_ADMIN_PASS );
	await loginPage.click( '#wp-submit' );
	await loginPage.waitForLoadState( 'networkidle' );
	await loginPage.close();

	const pages = [
		{ name: '01-homepage', url: '/', description: 'Homepage (storefront)' },
		{ name: '02-shop', url: '/shop/', description: 'Shop page' },
		{ name: '03-my-account', url: '/my-account/', description: 'My Account page' },
		{ name: '04-wp-admin-dashboard', url: '/wp-admin/', description: 'WP Admin Dashboard' },
		{ name: '05-wc-orders', url: '/wp-admin/admin.php?page=wc-orders', description: 'WooCommerce Orders' },
		{ name: '06-wc-products', url: '/wp-admin/edit.php?post_type=product', description: 'WooCommerce Products' },
		{ name: '07-wc-settings-general', url: '/wp-admin/admin.php?page=wc-settings', description: 'WooCommerce Settings General' },
		{ name: '08-wc-analytics-revenue', url: '/wp-admin/admin.php?page=wc-admin&path=%2Fanalytics%2Frevenue', description: 'WooCommerce Analytics Revenue' },
		{ name: '09-wc-status', url: '/wp-admin/admin.php?page=wc-status', description: 'WooCommerce System Status' },
	];

	for ( const pageInfo of pages ) {
		try {
			const page = await context.newPage();
			await page.goto( `${ BASE_URL }${ pageInfo.url }`, {
				waitUntil: 'networkidle',
				timeout: 30000,
			} );
			await page.waitForTimeout( 2000 ); // Allow dynamic content to load
			await page.screenshot( {
				path: path.join( OUTPUT_DIR, `${ pageInfo.name }.png` ),
				fullPage: true,
			} );
			console.log( `Captured: ${ pageInfo.description }` );
			await page.close();
		} catch ( error ) {
			console.error( `Failed to capture ${ pageInfo.description }: ${ error.message }` );
		}
	}

	// Try to capture a single product page
	try {
		const page = await context.newPage();
		await page.goto( `${ BASE_URL }/shop/`, { waitUntil: 'networkidle', timeout: 30000 } );
		const productLink = await page.$( 'a.woocommerce-LoopProduct-link, .products .product a' );
		if ( productLink ) {
			const href = await productLink.getAttribute( 'href' );
			if ( href ) {
				await page.goto( href, { waitUntil: 'networkidle', timeout: 30000 } );
				await page.waitForTimeout( 2000 );
				await page.screenshot( {
					path: path.join( OUTPUT_DIR, '03a-single-product.png' ),
					fullPage: true,
				} );
				console.log( 'Captured: Single product page' );
			}
		}
		await page.close();
	} catch ( error ) {
		console.error( `Failed to capture single product: ${ error.message }` );
	}

	// Try to capture cart page with items
	try {
		const page = await context.newPage();
		// Add a product to cart via Store API
		await page.goto( `${ BASE_URL }/shop/`, { waitUntil: 'networkidle', timeout: 30000 } );
		const addToCartBtn = await page.$( 'button.add_to_cart_button, a.add_to_cart_button' );
		if ( addToCartBtn ) {
			await addToCartBtn.click();
			await page.waitForTimeout( 3000 );
		}
		await page.goto( `${ BASE_URL }/cart/`, { waitUntil: 'networkidle', timeout: 30000 } );
		await page.waitForTimeout( 2000 );
		await page.screenshot( {
			path: path.join( OUTPUT_DIR, '03b-cart.png' ),
			fullPage: true,
		} );
		console.log( 'Captured: Cart page' );

		await page.goto( `${ BASE_URL }/checkout/`, { waitUntil: 'networkidle', timeout: 30000 } );
		await page.waitForTimeout( 2000 );
		await page.screenshot( {
			path: path.join( OUTPUT_DIR, '03c-checkout.png' ),
			fullPage: true,
		} );
		console.log( 'Captured: Checkout page' );
		await page.close();
	} catch ( error ) {
		console.error( `Failed to capture cart/checkout: ${ error.message }` );
	}

	await browser.close();
	console.log( `\nAll screenshots saved to: ${ OUTPUT_DIR }` );
}

captureScreenshots().catch( ( err ) => {
	console.error( 'Screenshot capture failed:', err );
	process.exit( 1 );
} );
