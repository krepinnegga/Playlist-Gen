export function log(...args) {
  console.log('[LOG]', ...args);
}

export function error(...args) {
  // Handle error objects better
  const formattedArgs = args.map(arg => {
    if (arg && typeof arg === 'object') {
      try {
        // Handle Spotify Web API errors specifically
        if (arg.name === 'WebapiError') {
          return {
            name: arg.name,
            message: arg.message,
            statusCode: arg.statusCode,
            body: arg.body,
            // Try to extract more details from the body
            details:
              arg.body?.error?.message ||
              arg.body?.error ||
              'No additional details',
          };
        }

        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return arg.toString();
      }
    }
    return arg;
  });

  console.error('[ERROR]', ...formattedArgs);
}
