import HtmlWebpackPlugin, { Options } from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import fs from "fs";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import Dotenv from "dotenv-webpack";

const PUBLIC_PATH = path.resolve(__dirname, "dist");

const HTML_WEBPACK_PLUGIN_OPTIONS: Options = {
  scriptLoading: "blocking",
  inject: "head",
  minify: false,
};

const config: Configuration & { devServer: DevServerConfiguration } = {
  entry: {
    index: "./src/js/index.ts",
    components: "./src/js/components/index.ts",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: PUBLIC_PATH,
    filename: "js/[name].js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "img/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(ts)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.html$/,
        loader: "underscore-template-loader",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({ filename: "css/style.css" }),
    ...generateHtmlPlugins("./src"),
    new CopyPlugin({
      patterns: [
        { from: "./src/img/", to: "./img/" },
        ...generateCopyPlugins("./src/html-dialogs"),
      ],
    }),
  ],
  devServer: {
    static: {
      directory: PUBLIC_PATH,
    },
    compress: false,
    port: 9000,
    historyApiFallback: true,
  },
};

function generateHtmlPlugins(templateDir: string) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles
    .map((item) => {
      const parts = item.split(".");
      const name = parts[0];
      const extension = parts[1];

      if (extension !== "html") return null;

      return new HtmlWebpackPlugin({
        ...HTML_WEBPACK_PLUGIN_OPTIONS,
        filename: `${name}.html`,
        template: path.resolve(
          __dirname,
          `${templateDir}/${name}.${extension}`,
        ),
      });
    })
    .filter((item) => item !== null);
}

function generateCopyPlugins(templateDir: string) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));

  return templateFiles
    .map((item) => {
      const parts = item.split(".");
      const name = parts[0];
      const extension = parts[1];

      if (extension !== "html") return null;

      return {
        from: `${templateDir}/${name}.${extension}`,
        to: `./${name}.${extension}`,
      };
    })
    .filter((item) => item !== null);
}

export default config;
