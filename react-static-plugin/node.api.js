export default ({ includePaths = [], cssLoaderOptions = {}, ...rest }) => ({
  webpack: (config, { stage }) => {
      // console.log('*******444'); process.exit()
      config.entry.push("../../../src/styles/bundle.scss")
  }
})