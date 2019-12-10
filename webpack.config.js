const path = require('path');                             // 絶対パスに変換するために

module.exports = {
  mode: 'development',        // 使える文字列が決まってる、本番用なのでproduction。
  entry: './src/doc/index.tsx',  // エントリポイントの指定、src下に書いていくので　src/index.tsxにしとく
  module: {
    rules: [
      {
        loader: 'ts-loader',      // ts-loaderを使う、こいつがトランスパイルしてくれる
        test: /\.tsx?$/,
        exclude: [
          /node_modules/
        ],
        options: {
          configFile: 'tsconfig.json' // TypeScriptのコンパイル設定ファイル
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]    // importの時に、これらの拡張子は解決してもらえる、要するにHoge.tsxをimport Hoge from './Hoge'みたいに書ける
  },
  output: {
    filename: 'demo.js',        // 仕上がりファイルの置き場
    path: path.resolve(__dirname, 'docs')   // 出力ディレクトリの指定の絶対パス
  },
  plugins: [
  ]
};