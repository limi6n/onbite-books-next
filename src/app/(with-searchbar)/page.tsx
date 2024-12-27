import BookItem from "@/components/book-item";
import style from "./page.module.css";
import { BookData } from "@/types";
import { Suspense } from "react";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";

async function AllBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const allBooks: BookData[] = await response.json();

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

async function RecBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`,
    { next: { revalidate: 3 } }
  );

  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const recBooks: BookData[] = await response.json();
  return (
    <div>
      {recBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <Suspense fallback={<BookListSkeleton count={3} />}>
          <RecBooks />
        </Suspense>
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <Suspense fallback={<BookListSkeleton count={10} />}>
          <AllBooks />
        </Suspense>
      </section>
    </div>
  );
}
