import React, { useEffect, useState } from "react";
import { getBoardDetail, deleteBoard } from "../api/board";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getBoardDetail(Number(id));
        setBoard(data);
      } catch (error) {
        alert("게시글 조회 실패");
      }
    };

    fetchBoard();
  }, [id]);

  const handleDelete = async () => {
    await deleteBoard(Number(id));
    alert("게시글 삭제 완료");
    navigate("/");
  };

  if (!board) return <p>loading..</p>;

  return (
    <Container>
      <h2>{board.title}</h2>
      <p>{board.content}</p>
      <button onClick={handleDelete}>삭제</button>
    </Container>
  );
};

export default BoardDetail;

const Container = styled.div`
  padding: 20px;
`;
