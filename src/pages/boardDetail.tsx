import React, { useEffect, useState } from "react";
import { getBoardDetail, deleteBoard, getBoardCategories } from "../api/board";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<{ title: string; content: string; boardCategory: string; imageUrl?: string; createdAt: string } | null>(null);
  const [categories, setCategories] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [boardData, categories] = await Promise.all([
          getBoardDetail(Number(id)),
          getBoardCategories(),
        ]);
        setBoard(boardData);
        setCategories(categories);
      } catch {
        alert("게시글 조회 실패");
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteBoard(Number(id));
      alert("게시글이 삭제되었습니다.");
      navigate("/");
    } catch {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (!board) return <p>로딩 중...</p>;

  return (
    <Container>
      <Title>{board.title}</Title>
      <Category>카테고리: {categories[board.boardCategory] ?? board.boardCategory}</Category>
      <CreatedDate>작성일: {new Date(board.createdAt).toLocaleDateString()}</CreatedDate>
      {board.imageUrl && <Image src={`https://front-mission.bigs.or.kr${board.imageUrl}`} alt="게시글 이미지" />}
      <Content>{board.content}</Content>

      <ButtonContainer>
        <Button onClick={() => navigate(`/edit/${id}`)}>수정</Button>
        <Button onClick={handleDelete}>삭제</Button>
        <Button onClick={() => navigate(-1)}>뒤로 가기</Button>
      </ButtonContainer>
    </Container>
  );
};

export default BoardDetail;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Category = styled.p`
  font-weight: bold;
  color: #555;
`;

const CreatedDate = styled.p`
  font-size: 14px;
  color: #888;
`;

const Content = styled.p`
  margin-top: 20px;
  line-height: 1.5;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  margin-top: 15px;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;
