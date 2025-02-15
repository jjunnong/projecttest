import React, { useState } from "react";
import { createBoard } from "../api/board";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CreateBoard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("NOTICE");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    try {
      await createBoard(title, content, category, file || undefined);
      alert("게시글 등록");
      navigate("/");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 실패");
    }
  };

  return (
    <Container>
      <h2>게시글 작성</h2>
      <Label>카테고리</Label>
      <Select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="NOTICE">공지</option>
        <option value="FREE">자유</option>
        <option value="QNA">Q&A</option>
        <option value="ETC">기타</option>
      </Select>
      <Label>제목</Label>
      <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Label>내용</Label>
      <Textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
      <Label>파일 업로드</Label>
      <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <Button onClick={handleSubmit}>등록</Button>
    </Container>
  );
};

export default CreateBoard;

const Container = styled.div`
  padding: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-top: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
`;
