import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import LatestBlogs from "../components/LatestBlogs";
import EachBlog from "../components/EachBlog";
import RightSection from "../components/RightSection";
import styles from "../styles/Home.module.css";
import FeaturedPosts from "../components/FeaturedPosts";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";

export default function Home({
  blogData,
  featuredPosts,
  moreBlogs,
  popular1,
  popular2,
  mangaFeatured,
  numberofBlogs,
  headers,
}) {
  // console.log(blogData);

  const [posts, setPosts] = useState(blogData);

  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?pagination[start]=${posts.length}&pagination[limit]=5&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories`,
      {
        headers: headers,
      }
    );

    const dataPosts = await res.json();

    const newPosts = dataPosts.data;

    setTimeout(() => {
      setPosts((posts) => [...posts, ...newPosts]);
    }, 2000);
  };

  useEffect(() => {
    setHasMore(numberofBlogs > posts.length ? true : false);
  }, [posts]);

  return (
    <div>
      <Head>
        <title>AniLog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto sm:p-8 p-2">
        <h1 className=" text-4xl sm:text-6xl tracking-wider text-center mb-2">
          Anilog
        </h1>
        <p className="font-montserrat mx-auto text-center mb-16 text-base sm:text-lg pb-2 border-b-2 border-b-error w-3/4">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur,
          molestias!
        </p>
        <FeaturedPosts blogData={featuredPosts} />
        <section className={styles.home_grid}>
          <section className="my-8">
            <h2 className="text-3xl  text-neutral-content border-b-4 border-error w-fit tracking-wider mb-4">
              Latest
            </h2>
            <InfiniteScroll
              dataLength={posts.length}
              next={getMorePosts}
              hasMore={hasMore}
              loader={<img src="/loader.gif" />}
              endMessage={
                <p className="text-center">
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {posts.map((eachBlog) => {
                return (
                  <Link
                    href={`/blogpost/${eachBlog.attributes.slug}`}
                    key={eachBlog.id}
                  >
                    <div className="w-5/6 mx-auto lg:w-full">
                      <EachBlog eachBlog={eachBlog} />
                    </div>
                  </Link>
                );
              })}
            </InfiniteScroll>
          </section>
          <RightSection
            moreBlogs={moreBlogs}
            popular1={popular1}
            popular2={popular2}
            mangaFeatured={mangaFeatured}
          />
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  let navCategories;
  let blogData;
  let featuredPosts;
  let moreBlogs;
  let popular1;
  let popular2;
  let mangaFeatured;
  let numberofBlogs;
  let headers = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };

  try {
    const [res1, res2, res3, res4, res5, res6, res7] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories`, {
        headers: headers,
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?pagination[limit]=17&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories`,
        {
          headers: headers,
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories&filters[featured]=true&pagination[limit]=5`,
        {
          headers: headers,
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[moreBlogs]=true`,
        {
          headers: headers,
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[popular1]=true`,
        {
          headers: headers,
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[popular2]=true`,
        {
          headers: headers,
        }
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?pagination[limit]=10&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories&filters[mangaFeatured]=true`,
        {
          headers: headers,
        }
      ),
    ]);
    const [json1, json2, json3, json4, json5, json6, json7] = await Promise.all(
      [
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
        res5.json(),
        res6.json(),
        res7.json(),
      ]
    );
    navCategories = json1.data;
    blogData = json2.data;
    featuredPosts = json3.data;
    numberofBlogs = json2.meta.pagination.total;
    moreBlogs = json4.data;
    popular1 = json5.data;
    popular2 = json6.data;
    mangaFeatured = json7.data;
  } catch (error) {
    throw new Error(error);
  }

  return {
    props: {
      navCategories,
      blogData,
      featuredPosts,
      moreBlogs,
      popular1,
      popular2,
      mangaFeatured,
      numberofBlogs,
      headers,
    }, // will be passed to the page component as props
  };
}
