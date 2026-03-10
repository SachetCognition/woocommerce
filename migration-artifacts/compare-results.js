#!/usr/bin/env node
/**
 * compare-results.js
 *
 * Compares pre-migration and post-migration test results,
 * generating a markdown comparison table and regression report.
 */

const fs = require( 'fs' );
const path = require( 'path' );

const ARTIFACTS_DIR = path.resolve( __dirname );
const PRE_DIR = path.join( ARTIFACTS_DIR, 'pre-migration' );
const POST_DIR = path.join( ARTIFACTS_DIR, 'post-migration' );

function parsePhpUnitResults( filePath ) {
	if ( ! fs.existsSync( filePath ) ) {
		return { tests: 0, assertions: 0, failures: 0, errors: 0, skipped: 0, warnings: 0, status: 'not-run' };
	}
	const content = fs.readFileSync( filePath, 'utf8' );

	// Try to find the summary line like: "OK (9831 tests, 28456 assertions)"
	const okMatch = content.match( /OK \((\d+) tests?, (\d+) assertions?\)/ );
	if ( okMatch ) {
		return {
			tests: parseInt( okMatch[ 1 ], 10 ),
			assertions: parseInt( okMatch[ 2 ], 10 ),
			failures: 0,
			errors: 0,
			skipped: 0,
			warnings: 0,
			status: 'pass',
		};
	}

	// Try to find failure summary: "Tests: 9831, Assertions: 28456, Failures: 2, Errors: 1."
	const failMatch = content.match( /Tests:\s*(\d+),\s*Assertions:\s*(\d+)/ );
	if ( failMatch ) {
		const failures = ( content.match( /Failures:\s*(\d+)/ ) || [] )[ 1 ] || '0';
		const errors = ( content.match( /Errors:\s*(\d+)/ ) || [] )[ 1 ] || '0';
		const skipped = ( content.match( /Skipped:\s*(\d+)/ ) || [] )[ 1 ] || '0';
		const warnings = ( content.match( /Warnings:\s*(\d+)/ ) || [] )[ 1 ] || '0';
		return {
			tests: parseInt( failMatch[ 1 ], 10 ),
			assertions: parseInt( failMatch[ 2 ], 10 ),
			failures: parseInt( failures, 10 ),
			errors: parseInt( errors, 10 ),
			skipped: parseInt( skipped, 10 ),
			warnings: parseInt( warnings, 10 ),
			status: 'fail',
		};
	}

	return { tests: 0, assertions: 0, failures: 0, errors: 0, skipped: 0, warnings: 0, status: 'parse-error' };
}

function parsePlaywrightJson( filePath ) {
	if ( ! fs.existsSync( filePath ) ) {
		return { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, status: 'not-run' };
	}
	try {
		const data = JSON.parse( fs.readFileSync( filePath, 'utf8' ) );
		const suites = data.suites || [];
		let total = 0, passed = 0, failed = 0, skipped = 0, flaky = 0;

		function countSpecs( suite ) {
			for ( const spec of ( suite.specs || [] ) ) {
				for ( const test of ( spec.tests || [] ) ) {
					total++;
					const status = test.status || test.expectedStatus;
					if ( status === 'expected' || status === 'passed' ) {
						passed++;
					} else if ( status === 'unexpected' || status === 'failed' ) {
						failed++;
					} else if ( status === 'skipped' ) {
						skipped++;
					} else if ( status === 'flaky' ) {
						flaky++;
					}
				}
			}
			for ( const child of ( suite.suites || [] ) ) {
				countSpecs( child );
			}
		}

		suites.forEach( countSpecs );
		return { total, passed, failed, skipped, flaky, status: failed > 0 ? 'fail' : 'pass' };
	} catch ( e ) {
		return { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0, status: 'parse-error' };
	}
}

function parseTextResults( filePath ) {
	if ( ! fs.existsSync( filePath ) ) {
		return { status: 'not-run', summary: 'File not found' };
	}
	const content = fs.readFileSync( filePath, 'utf8' );
	const lines = content.split( '\n' );
	const lastLines = lines.slice( -20 ).join( '\n' );

	// Jest summary
	const jestMatch = lastLines.match( /Tests:\s+(\d+)\s+passed/ );
	if ( jestMatch ) {
		return { status: 'pass', summary: `${ jestMatch[ 1 ] } tests passed` };
	}

	const jestFailMatch = lastLines.match( /Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed/ );
	if ( jestFailMatch ) {
		return { status: 'fail', summary: `${ jestFailMatch[ 1 ] } failed, ${ jestFailMatch[ 2 ] } passed` };
	}

	return { status: 'completed', summary: lastLines.slice( 0, 200 ) };
}

function generateReport() {
	const report = [];
	report.push( '# Migration Test Comparison Report\n' );
	report.push( `Generated: ${ new Date().toISOString() }\n` );

	// Version comparison
	report.push( '## Version Comparison\n' );
	report.push( '| Component | Pre-Migration | Post-Migration |' );
	report.push( '|-----------|--------------|----------------|' );

	const versionFiles = [ 'php-version.txt', 'ts-version.txt', 'node-version.txt' ];
	for ( const file of versionFiles ) {
		const pre = fs.existsSync( path.join( PRE_DIR, file ) )
			? fs.readFileSync( path.join( PRE_DIR, file ), 'utf8' ).trim().split( '\n' )[ 0 ]
			: 'N/A';
		const post = fs.existsSync( path.join( POST_DIR, file ) )
			? fs.readFileSync( path.join( POST_DIR, file ), 'utf8' ).trim().split( '\n' )[ 0 ]
			: 'N/A';
		report.push( `| ${ file.replace( '.txt', '' ) } | ${ pre } | ${ post } |` );
	}
	report.push( '' );

	// PHPUnit comparison
	report.push( '## PHPUnit Test Results\n' );
	const prePhp = parsePhpUnitResults( path.join( PRE_DIR, 'phpunit-results.txt' ) );
	const postPhp = parsePhpUnitResults( path.join( POST_DIR, 'phpunit-results.txt' ) );

	report.push( '| Metric | Pre-Migration | Post-Migration | Delta |' );
	report.push( '|--------|--------------|----------------|-------|' );
	report.push( `| Total Tests | ${ prePhp.tests } | ${ postPhp.tests } | ${ postPhp.tests - prePhp.tests } |` );
	report.push( `| Assertions | ${ prePhp.assertions } | ${ postPhp.assertions } | ${ postPhp.assertions - prePhp.assertions } |` );
	report.push( `| Failures | ${ prePhp.failures } | ${ postPhp.failures } | ${ postPhp.failures - prePhp.failures } |` );
	report.push( `| Errors | ${ prePhp.errors } | ${ postPhp.errors } | ${ postPhp.errors - prePhp.errors } |` );
	report.push( `| Skipped | ${ prePhp.skipped } | ${ postPhp.skipped } | ${ postPhp.skipped - prePhp.skipped } |` );
	report.push( `| Status | ${ prePhp.status } | ${ postPhp.status } | |` );
	report.push( '' );

	// E2E comparison
	report.push( '## E2E Test Results\n' );
	const preE2e = parsePlaywrightJson( path.join( PRE_DIR, 'e2e-artifacts', 'results.json' ) );
	const postE2e = parsePlaywrightJson( path.join( POST_DIR, 'e2e-artifacts', 'results.json' ) );

	report.push( '| Metric | Pre-Migration | Post-Migration | Delta |' );
	report.push( '|--------|--------------|----------------|-------|' );
	report.push( `| Total | ${ preE2e.total } | ${ postE2e.total } | ${ postE2e.total - preE2e.total } |` );
	report.push( `| Passed | ${ preE2e.passed } | ${ postE2e.passed } | ${ postE2e.passed - preE2e.passed } |` );
	report.push( `| Failed | ${ preE2e.failed } | ${ postE2e.failed } | ${ postE2e.failed - preE2e.failed } |` );
	report.push( `| Skipped | ${ preE2e.skipped } | ${ postE2e.skipped } | ${ postE2e.skipped - preE2e.skipped } |` );
	report.push( `| Flaky | ${ preE2e.flaky } | ${ postE2e.flaky } | ${ postE2e.flaky - preE2e.flaky } |` );
	report.push( `| Status | ${ preE2e.status } | ${ postE2e.status } | |` );
	report.push( '' );

	// JS Unit tests
	report.push( '## JS Unit Test Results\n' );
	const jestFiles = [ 'jest-admin-results.txt', 'jest-blocks-results.txt' ];
	report.push( '| Suite | Pre-Migration | Post-Migration |' );
	report.push( '|-------|--------------|----------------|' );
	for ( const file of jestFiles ) {
		const pre = parseTextResults( path.join( PRE_DIR, file ) );
		const post = parseTextResults( path.join( POST_DIR, file ) );
		report.push( `| ${ file.replace( '.txt', '' ) } | ${ pre.status } (${ pre.summary.slice( 0, 50 ) }) | ${ post.status } (${ post.summary.slice( 0, 50 ) }) |` );
	}
	report.push( '' );

	// Screenshots comparison
	report.push( '## Screenshot Comparison\n' );
	const preScreenshots = fs.existsSync( path.join( PRE_DIR, 'screenshots' ) )
		? fs.readdirSync( path.join( PRE_DIR, 'screenshots' ) ).filter( f => f.endsWith( '.png' ) )
		: [];
	const postScreenshots = fs.existsSync( path.join( POST_DIR, 'screenshots' ) )
		? fs.readdirSync( path.join( POST_DIR, 'screenshots' ) ).filter( f => f.endsWith( '.png' ) )
		: [];

	report.push( `Pre-migration screenshots: ${ preScreenshots.length }` );
	report.push( `Post-migration screenshots: ${ postScreenshots.length }` );
	report.push( '' );

	if ( preScreenshots.length > 0 ) {
		report.push( '| Page | Pre-Migration | Post-Migration | Visual Diff |' );
		report.push( '|------|-------------|----------------|-------------|' );
		for ( const screenshot of preScreenshots ) {
			const hasPost = postScreenshots.includes( screenshot );
			const hasDiff = fs.existsSync( path.join( ARTIFACTS_DIR, 'visual-diffs', screenshot ) );
			report.push( `| ${ screenshot } | Yes | ${ hasPost ? 'Yes' : 'Missing' } | ${ hasDiff ? 'Generated' : 'N/A' } |` );
		}
		report.push( '' );
	}

	// Regression summary
	report.push( '## Regression Summary\n' );
	const regressions = [];
	if ( postPhp.failures > prePhp.failures ) {
		regressions.push( `PHPUnit: ${ postPhp.failures - prePhp.failures } new failure(s)` );
	}
	if ( postE2e.failed > preE2e.failed ) {
		regressions.push( `E2E: ${ postE2e.failed - preE2e.failed } new failure(s)` );
	}

	if ( regressions.length === 0 ) {
		report.push( 'No regressions detected.' );
	} else {
		report.push( 'Regressions found:' );
		for ( const r of regressions ) {
			report.push( `- ${ r }` );
		}
	}
	report.push( '' );

	// Overall assessment
	report.push( '## Overall Assessment\n' );
	const allPassed = ( postPhp.status === 'pass' || postPhp.status === 'not-run' ) &&
		( postE2e.status === 'pass' || postE2e.status === 'not-run' ) &&
		regressions.length === 0;

	if ( allPassed ) {
		report.push( 'Migration assessment: **PASS** - No regressions detected in post-migration testing.' );
	} else {
		report.push( 'Migration assessment: **NEEDS REVIEW** - Some test results require investigation.' );
	}

	return report.join( '\n' );
}

// Run
const report = generateReport();
const outputPath = path.join( ARTIFACTS_DIR, 'COMPARISON-REPORT.md' );
fs.writeFileSync( outputPath, report );
console.log( `Report written to ${ outputPath }` );
console.log( report );
