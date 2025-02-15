import React, { useEffect, useState } from "react";
import { getBoardList } from "../api/board";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, [page]);

  const fetchBoards = async () => {
    try {
      const response = await getBoardList(page, 10);
      setBoards(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("게시글 목록 조회 실패:", error);
    }
  };

  return (
    <Container>
      <h2>게시판</h2>
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
          {boards.map((board) => (
            <tr key={board.id} onClick={() => navigate(`/board/${board.id}`)}>
              <td>{board.id}</td>
              <td>{board.title}</td>
              <td>{board.category}</td>
              <td>{new Date(board.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          이전
        </button>
        <span>{page + 1} / {totalPages}</span>
        <button disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>
          다음
        </button>
      </Pagination>
    </Container>
  );
};

export default BoardList;

const Container = styled.div`
  padding: 20px;
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
