import path from 'path'
import axios from 'axios'


const fs = require("fs");
const bannerImages = fs.readdirSync("./public/static/images/banners")
    .map(file => file.replace(/\.\w*$/, ""));

export default {
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )

    return [
      {
        path: '/',
        getData: () => ({
          cake: 42
        }),
      },
    //   {
    //     path: '/blog',
    //     getData: () => ({
    //       posts,
    //     }),
    //     children: posts.map(post => ({
    //       path: `/post/${post.id}`,
    //       template: 'src/containers/Post',
    //       getData: () => ({
    //         post,
    //       }),
    //     })),
    //   },
    ]
  },
//   entry: ["index.js", "/home/callumgare/repos/ask-izzy/src/styles/bundle.scss"],
  plugins: [
    "../react-static-plugin",
    [
        "react-static-plugin-sass",
        {
            data: `$banner-images: ${bannerImages.join(" ")};`
        }
    ],
    // () => {console.log('*******444'); process.exit()}
    // [
    //   require.resolve('react-static-plugin-source-filesystem'),
    //   {
    //     location: path.resolve('./src/pages'),
    //   },
    // ],
    // require.resolve('react-static-plugin-reach-router'),
    // require.resolve('react-static-plugin-sitemap'),
  ],
}
