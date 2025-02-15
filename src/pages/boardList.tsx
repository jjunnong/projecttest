import React, { useEffect, useState } from "react";
import { getBoardList, getBoardCategories } from "../api/board";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<{ id: number; title: string; category: string; createdAt: string }[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await getBoardList(page, 10);
        setBoards(response.content);
        setTotalPages(response.totalPages || 1);
      } catch {
        console.error("게시글 목록 조회 실패");
      }
    })();
  }, [page]);

  useEffect(() => {
    (async () => {
      try {
        const categoryData = await getBoardCategories();
        setCategories(categoryData);
      } catch {
        console.error("카테고리 조회 실패");
      }
    })();
  }, []);

  return (
    <Container>
      <Header>
        <h2>게시판</h2>
        <CreateButton onClick={() => navigate("/create")}>글 작성</CreateButton>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>카테고리</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(({ id, title, category, createdAt }) => (
            <tr key={id} onClick={() => navigate(`/board/${id}`)}>
              <td>{id}</td>
              <td>{title}</td>
              <td>{categories[category] ?? category}</td>
              <td>{new Date(createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>이전</button>
        <span>{page + 1} / {totalPages}</span>
        <button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>다음</button>
      </Pagination>
    </Container>
  );
};

export default BoardList;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 10px;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 5px;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const CreateButton = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #218838;
  }
`;