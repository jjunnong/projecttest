import React, { useEffect, useState } from "react";
import { createBoard, getBoardCategories } from "../api/board";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CreateBoard: React.FC = () => {
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [categories, setCategories] = useState<[string, string][]>([]);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBoardCategories();
        const categoryEntries = Object.entries(data) as [string, string][];
        setCategories(categoryEntries);
        setForm((prev) => ({ ...prev, category: categoryEntries[0]?.[0] || "" }));
      } catch {
        alert("카테고리를 불러올 수 없습니다");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert("제목과 내용을 입력하세요");

    try {
      await createBoard(form.title, form.content, form.category, file || undefined);
      alert("게시글 등록 완료");
      navigate("/");
    } catch {
      alert("게시글 등록 실패");
    }
  };

  return (
    <Container>
      <h2>게시글 작성</h2>
      <Label>카테고리</Label>
      <Select name="category" value={form.category} onChange={handleChange}>
        {categories.length > 0 ? (
          categories.map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))
        ) : (
          <option>카테고리 없음</option>
        )}
      </Select>
      <Label>제목</Label>
      <Input name="title" placeholder="제목" value={form.title} onChange={handleChange} />
      <Label>내용</Label>
      <Textarea name="content" placeholder="내용" value={form.content} onChange={handleChange} />
      <Label>파일 업로드</Label>
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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
