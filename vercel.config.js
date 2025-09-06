// Vercel Configuration Options
module.exports = {
  build: {
    command: "echo 'No build step'",
    outputDirectory: ".",
  },
  functions: {
    directory: "api",
  },
  routes: [{ source: "/api/contact", destination: "/api/contact/index.js" }],
};
