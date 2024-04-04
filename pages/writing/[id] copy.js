import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Center from "@/components/Main/Center";

export default function AnonymousWriting() {
  const router = useRouter();
  const { id } = router.query;

  // post 상태를 null로 초기화합니다.
  const [post, setPost] = useState(null);
  // 댓글 내용을 위한 상태 추가
  const [comment, setComment] = useState("");
  // 댓글 목록을 위한 상태 추가
  const [comments, setComments] = useState([]);

  const readPostAndComments = async () => {
    if (!id) return; // id가 없다면 함수를 실행하지 않습니다.

    // 게시물 불러오기
    try {
      const postResponse = await fetch(`/api/getSinglePost?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!postResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const postData = await postResponse.json();
      setPost(postData);
    } catch (e) {
      console.error(e);
    }

    // 댓글 불러오기
    try {
      const commentsResponse = await fetch(`/api/getComments?postId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!commentsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const commentsData = await commentsResponse.json();
      setComments(commentsData); // 받아온 댓글 데이터로 comments 상태를 업데이트합니다.
    } catch (e) {
      console.error("Failed to load comments:", e);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return alert("댓글을 입력해주세요.");

    try {
      const response = await fetch(`/api/setCommentPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: id, content: comment }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setComment(""); // 댓글 제출 후 입력 필드 초기화
      // 여기서 댓글 목록을 다시 불러오는 로직을 추가할 수 있습니다.
    } catch (e) {
      console.error(e);
    }
  };

  // 날짜 포맷 함수
  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);

    // 개별 구성요소를 추출
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth()는 0부터 시작하므로 +1 필요
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // 포맷에 맞게 조합
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  useEffect(() => {
    readPostAndComments();
  }, [id]); // id 값의 변화를 감지하여 변할 때마다 readPost 함수를 실행합니다.

  // 로딩 상태 처리를 위해 post가 null인 경우 로딩 메시지를 표시합니다.
  if (!post) return <div>Loading...</div>;

  return (
    <>
      <Center>
        <div>
          {/* 포스트 데이터를 화면에 표시합니다. */}
          <h2>제목 : {post.title}</h2> {/* 제목 */}
          <h4>작성자 : {post.nickname}</h4> {/* 작성자 */}
          <h4>날짜 : {formatDateTime(post.createdAt)}</h4> {/* 날짜 */}
          <hr />
          <br />
          <h4>글내용</h4>
          <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>{" "}
          {/* 내용 */}
          {/* 추가적으로, 작성자, 날짜 등의 정보가 있다면 여기에 표시할 수 있습니다. */}
        </div>
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            style={{ width: "100%", height: "100px" }}
          ></textarea>
          <button onClick={submitComment}>댓글 작성</button>
        </div>
        {/* 댓글 목록 표시 */}
        <div>
          <h3>댓글</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id}>
                <p>
                  <strong>{comment.nickname}</strong> (
                  {formatDateTime(comment.createdAt)}):
                </p>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>
        <button onClick={() => router.back()}>뒤로가기</button>
      </Center>
    </>
  );
}
