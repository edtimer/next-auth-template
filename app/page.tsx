import { SubscriptionForm } from "@/components/subscription-form";

export default async function Home() {
  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl text-center mt-12 font-bold">
        Next.js(v15) + Auth.js(v5) Course
      </h1>
      <p className="mt-12 text-gray-700">
        Implementing authentication and authorization in a Next.js app using
        Auth.js is no easy task. You might spend weeks and even then there is no
        guarantee of success. You're most likely to get stuck trying to figure
        out an obscure error, but never really manage to fix it, leaving all the
        hard work in vain.
      </p>
      <p className="mt-6 text-gray-700">
        Like many developers, I spent weeks, but managed to solve all
        authetication challenges after much trial and error. Now I'm building a
        course to share these hard-earned lessons, so you can implement
        authentication and authorization in just a few hours.
      </p>
      <p className="mt-6 text-gray-700">
        In the course, you&apos;ll learn how to implement:
      </p>
      <ul className="mt-6 space-y-1 text-gray-700 ml-8 list-disc">
        <li>Sign in with Google</li>
        <li>Sign in with email</li>
        <li>Sign in with email and password</li>
      </ul>
      <p className="mt-6 text-gray-700">
        I am planning to finish the course in the next two weeks. It will be a
        text based course and will be released in my{" "}
        <a
          href="https://hemantasundaray.com"
          className="text-blue-600 hover:no-underline underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          personal website
        </a>
        .
      </p>
      <p className="mt-6 text-gray-700">
        If you want to get notified as soon as the course is released, subscribe
        below:
      </p>
      <SubscriptionForm />
    </div>
  );
}
