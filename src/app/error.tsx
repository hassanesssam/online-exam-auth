"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <main>ERROR! {error.message}</main>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}