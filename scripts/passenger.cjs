// cPanel Passenger entrypoint: read-only API. Cron runs collection separately.
process.chdir(__dirname);
process.env.API_BASE_PATH='/data';
process.env.PORT=process.env.PORT||'4174';
process.env.SELF_HOSTED_COLLECTOR='true';
process.argv.push('--serve');
import('./scripts/collector.mjs').catch(e=>{console.error(e);process.exit(1)});
