import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Center from '@/components/Main/Center';

export default function Writing() {
    const router = useRouter();
    const { id } = router.query;

    // post 상태를 null로 초기화합니다.
    const [post, setPost] = useState(null);

    const readPost = async () => {
        if (!id) return; // id가 없다면 함수를 실행하지 않습니다.

        try {
            const response = await fetch(`/api/getSinglePost?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPost(data); // 받아온 데이터로 post 상태를 업데이트합니다.
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        readPost();
    }, [id]); // id 값의 변화를 감지하여 변할 때마다 readPost 함수를 실행합니다.

    // 로딩 상태 처리를 위해 post가 null인 경우 로딩 메시지를 표시합니다.
    if (!post) return <div>Loading...</div>;

    return (
        <>
            <Center>
                <h1>Writing</h1>
                <p>Post ID: {id}</p>
                <div>
                    {/* 포스트 데이터를 화면에 표시합니다. */}
                    <h2>{post.title}</h2> {/* 제목 */}
                    <p>{post.content}</p> {/* 내용 */}
                    {/* 추가적으로, 작성자, 날짜 등의 정보가 있다면 여기에 표시할 수 있습니다. */}
                </div>
            </Center>
        </>
    );
}