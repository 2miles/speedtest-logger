# Internet Speed Logger

This is a **Node.js + TypeScript** script that logs **internet download speeds** using [Fast.com](https://fast.com).  
It runs at a 10 minute interval (configurable) and stores the results in daily CSV log files in ./logs.

## Features

- **Logs download speed every 10 minutes**
- **Automatically creates a new CSV file daily** (`speed_2025-03-12.csv`)
- **Runs continuously and self-heals** (handles Fast.com errors & retries)

## Installation & Setup

### Install Node.js & NPM

Ensure you have Node.js and NPM installed:

```bash
node -v   # Check Node.js version
npm -v    # Check NPM version
```

If not installed, download from [nodejs.org](https://nodejs.org/).

### Clone the Repository

```bash
git clone https://github.com/your-username/speedtest-logger.git
cd speedtest-logger
```

### Install Dependencies

```bash
npm install
```

### Initialize TypeScript (If Needed)

If you're setting up TypeScript from scratch, run:

```bash
tsc --init
```

This creates a **`tsconfig.json`** file that allows TypeScript compilation.

### Build the TypeScript Project

Every time you **edit your TypeScript code**, recompile it:

```bash
npm run build
```

This compiles `.ts` files into `.js` files inside the `dist/` folder.

### Start the Script

```bash
npm start
```

This will:

- **Run a Fast.com speed test every 10 minutes**
- **Save logs to daily CSV files**

### Making Edits & Re-running

If you make changes to the TypeScript files, rebuild and restart the script:

```bash
npm run build && npm start
```

## Configuration

### Edit the Interval

By default, the script runs every **10 minutes (600s)**.  
You can change this in `src/speedtest.ts`:

```typescript
const INTERVAL: number = 600; // Change to desired interval (in seconds)
```

### Change the Log Directory

By default, logs are saved in `./logs/`.  
To change this, update:

```typescript
const LOG_DIR: string = './logs';
```

### Change the Log Directory

By default, the timezone is set to `America/Los_Angeles`.  
To change this, update:

```typescript
const TIME_ZONE: string = 'America/Los_Angeles';
```

---

## Running the Script

### Start Logging

```bash
npm start
```

This will:

- Run a Fast.com speed test every 10 minutes
- Save logs to daily CSV files

### Example Log Output

```csv
date,time,speed
2025-03-11,01:23:51,340.00
2025-03-11,01:37:54,300.00
2025-03-11,01:43:26,0.00
2025-03-11,01:53:44,310.00
```

---

## 🐳 Running in Docker (Optional)

To run the script in a **Docker container on a Synology NAS**:

### **1️⃣ Create a `Dockerfile`**

Inside your project folder, create a file named `Dockerfile`:

```dockerfile
FROM node:20

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/speedtest.js"]
```

### **2️⃣ Build and Run the Container**

```bash
docker build -t speedtest-logger .
docker run -d --name speedtest-logger speedtest-logger
```

### **3️⃣ Check Logs**

```bash
docker logs speedtest-logger -f
```

---

## Troubleshooting

### **Fast.com CLI Crashes (`Phantom Process died`)**

This happens when:

- **Fast.com is rate-limiting you** (try increasing interval to 15-20 min)
- **Low memory on the system** (especially in Docker)

#### **Solution**

1. Increase the test interval:
2. Restart the script:

### **No Logs Are Being Created**

1. Check if the script is running:
   ```bash
   ps aux | grep node
   ```
2. Manually test Fast.com:
   ```bash
   npx fast --json
   ```
   - If Fast.com fails, you may need to wait (rate limit).
