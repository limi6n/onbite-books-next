"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset, // 에러 복구를 위한 새로고침 함수 제공
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          router.refresh();
          reset();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
