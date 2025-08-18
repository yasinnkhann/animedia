/* eslint-disable @typescript-eslint/no-var-requires */
const cron = require('node-cron');
const { exec } = require('child_process');

cron.schedule('*/5 * * * *', () => {
	console.log('Running cron job to query users...');
	exec(
		'npx ts-node ./scripts/queryUsers.ts',
		(err: Error | null, stdout: string, stderr: string) => {
			if (err) {
				console.error('Cron job error:', err);
				return;
			}
			if (stderr) {
				console.error('Cron job stderr:', stderr);
			}
			console.log('Cron job output:', stdout);
		}
	);
});
