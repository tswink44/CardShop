/**
 * Measures and reports web vitals performance metrics.
 *
 * This function imports the necessary functions from the 'web-vitals' library
 * to measure various performance metrics including Cumulative Layout Shift (CLS),
 * First Input Delay (FID), First Contentful Paint (FCP), Largest Contentful Paint (LCP),
 * and Time to First Byte (TTFB). If a callback function is provided and it is an
 * instance of a Function, these metrics are measured and the results are passed
 * to the callback.
 *
 * @param {Function} onPerfEntry - Callback function to receive performance metrics.
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
