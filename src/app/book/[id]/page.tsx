import { notFound } from "next/navigation";
import style from "./page.module.css";

// build 타임에 해당 페이지를 정적 페이지로 생성하게 됨.
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    return <div>오류가 발생했습니다...</div>;
  }

  const book = await response.json();

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

function ReviewEditor({ bookId }: { bookId: string }) {
  async function createReviewAction(formData: FormData) {
    "use server";

    const content = formData.get("contnet")?.toString;
    const author = formData.get("author")?.toString;

    if (!content || !author) {
      return;
    }

    console.log(bookId);
    console.log(content);
    console.log(author);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/review`, {
        method: "POST",
        body: JSON.stringify({
          bookId,
          content,
          author,
        }),
      });
      console.log(response.body);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <section>
      <form action={createReviewAction}>
        <input required name="content" placeholder="리뷰 내용" />
        <input required name="author" placeholder="작성자" />
        <button type="submit">작성하기</button>
      </form>
    </section>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
    </div>
  );
}
