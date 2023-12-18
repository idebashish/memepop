const RATE_LIMIT = 600; // Max number of requests per 10 minutes
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

let requestsMade = 0;
let windowStart = Date.now();

// Check if a request can be made based on the rate limit
function requestCanProceed() {
    const currentTime = Date.now();

    // Reset the count every 10 minutes
    if (currentTime - windowStart > RATE_LIMIT_WINDOW) {
        requestsMade = 0;
        windowStart = currentTime;
    }

    // Check if the rate limit has been reached
    if (requestsMade < RATE_LIMIT) {
        requestsMade++;
        return true;
    } else {
        return false;
    }
}

// Function to simulate waiting for the rate limit to reset
function waitForRateLimitReset() {
    const currentTime = Date.now();
    const timeSinceWindowStart = currentTime - windowStart;
    const timeToWait = RATE_LIMIT_WINDOW - timeSinceWindowStart;

    return new Promise(resolve => setTimeout(resolve, timeToWait));
}

export { requestCanProceed, waitForRateLimitReset };
