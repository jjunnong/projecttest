import React, { useEffect, useState } from "react";
import { getBoardDetail, updateBoard, getBoardCategories } from "../api/board";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const EditBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardData, categoryData] = await Promise.all([
          getBoardDetail(Number(id)),
          getBoardCategories(),
        ]);

        setTitle(boardData.title);
        setContent(boardData.content);
        setCategory(boardData.boardCategory);
        setCategories(categoryData);
      } catch (error) {
        alert("게시글 정보를 불러올 수 없습니다.");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBoard(Number(id), title, content, category, file);
      alert("게시글이 수정되었습니다.");
      navigate(`/board/${id}`);
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  return (
    <Container>
      <h2>게시글 수정</h2>
      <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
      <StyledTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
      <StyledSelect value={category} onChange={(e) => setCategory(e.target.value)}>
        {Object.entries(categories).map(([key, value]) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </StyledSelect>
      <StyledInput type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <SubmitButton onClick={handleSubmit}>수정 완료</SubmitButton>
    </Container>
  );
};

export default EditBoard;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  margin-top: 15px;
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;
