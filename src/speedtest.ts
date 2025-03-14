import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { formatInTimeZone } from 'date-fns-tz'; // For Pacific Time formatting

const INTERVAL: number = 600; // 10 minutes
const LOG_DIR: string = './logs';
const TIME_ZONE: string = 'America/Los_Angeles';

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const runSpeedTest = (): void => {
  console.log(`Running speed test...`);
  exec('npx fast --json', (error, stdout, stderr) => {
    // Get timestamp & current date for logging
    const timestamp: string = formatInTimeZone(
      new Date(),
      TIME_ZONE,
      'yyyy-MM-dd HH:mm:ss',
    );
    if (error) {
      console.error(`Error running "npx fast --json": ${error.message}`);
      if (
        error.message.includes('Please check your internet connection') ||
        error.message.includes('Phantom Process died')
      ) {
        logSpeed(timestamp, 0.0);
      }
      scheduleNextTest();
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      scheduleNextTest();
      return;
    }

    console.log(timestamp);
    console.log(`Output:\t${stdout.trim()}\n`); // Debugging output

    const speedMatch = stdout.match(/([\d.]+)\s*(Mbps|Kbps)/);
    if (speedMatch) {
      let downloadSpeed: number = parseFloat(speedMatch[1]);
      const unit = speedMatch[2];

      // Convert Kbps to Mbps
      if (unit === 'Kbps') {
        downloadSpeed /= 1000;
      }
      logSpeed(timestamp, downloadSpeed);
    } else {
      console.error(
        'Could not extract speed from Fast.com output. Skipping entry.',
      );
    }

    scheduleNextTest();
  });
};

// Log speed test results to a CSV file (creates a new file at midnight Pacific Time)
const logSpeed = (timestamp: string, downloadSpeed: number): void => {
  const [date, time] = timestamp.split(' '); // Split timestamp into date & time
  const logFile: string = path.join(LOG_DIR, `speed_${date}.csv`);
  const logEntry: string = `${date},${time},${downloadSpeed.toFixed(2)}\n`;
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, 'date,time,speed\n');
  }
  fs.appendFileSync(logFile, logEntry);
};

// Schedule next test with INTERVAL delay
const scheduleNextTest = (): void => {
  console.log(`Waiting ${INTERVAL / 60} minutes...`);
  setTimeout(runSpeedTest, INTERVAL * 1000);
};

// Start the process
runSpeedTest();
