// vue.config.js
module.exports = {
    rules: {
        test: /\.(html)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "html-loader"
        }
    }
}