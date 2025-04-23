import React from "react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      category: "Maintenance",
      date: "March 12, 2025",
      title: "5 Essential Car Maintenance Tips for Every Owner",
      description:
        "Regular maintenance is key to keeping your car running smoothly. Learn about oil changes, tire rotations, brake checks, and more!",
    },
    {
      id: 2,
      category: "Repairs",
      date: "March 5, 2025",
      title: "How to Identify and Fix Common Car Problems",
      description:
        "Strange noises? Check engine light on? Learn how to diagnose and fix common car issues before they become costly repairs.",
    },
    {
      id: 3,
      category: "Car Services",
      date: "February 25, 2025",
      title: "The Ultimate Guide to Choosing the Right Car Service",
      description:
        "Not sure which service package to choose? We break down different car services and help you decide what’s best for your vehicle.",
    },
  ];

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-100">
          {blogPosts.map((post) => (
            <div key={post.id} className="py-8 flex flex-wrap md:flex-nowrap">
              <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                <span className="font-semibold title-font text-gray-700">
                  {post.category}
                </span>
                <span className="mt-1 text-gray-500 text-sm">{post.date}</span>
              </div>
              <div className="md:flex-grow">
                <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                  {post.title}
                </h2>
                <p className="leading-relaxed">{post.description}</p>
                <a className="text-indigo-500 inline-flex items-center mt-4" href="#">
                  Learn More
                  <svg
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
