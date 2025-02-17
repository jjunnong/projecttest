import React, { useEffect, useState } from "react";
import { getBoardList, getBoardCategories } from "../api/board";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<{ id: number; title: string; category: string; createdAt: string; author: string }[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [name, setName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await getBoardList(0, 100, selectedCategory, searchTerm);
        setBoards(response.content);
      } catch {
        console.error("게시글 목록 조회 실패");
      }
    })();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);

    const handleStorageChange = () => {
      setName(localStorage.getItem("name"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSearchTerm("");
    setPage(0);
  };

  const fetchBoards = async () => {
    try {
      const response = await getBoardList(0, 100, selectedCategory, searchQuery);
      setBoards(response.content);
    } catch {
      console.error("게시글 목록 조회 실패");
    }
  };
  
  const handleSearch = () => {
    setSearchTerm(searchQuery);
    setPage(0);
    fetchBoards();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchBoards();
  },);

  const noticeBoards = boards
    .filter(board => board.category === "NOTICE")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredBoards = boards
    .filter(board => board.category !== "NOTICE")
    .filter(board => (selectedCategory === "" || board.category === selectedCategory))
    .filter(board => board.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPages = Math.ceil(filteredBoards.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBoards = filteredBoards.slice(startIndex, endIndex);
  const visiblePageCount = 10;
  const pageGroup = Math.floor(page / visiblePageCount);
  const startPage = pageGroup * visiblePageCount;
  const endPage = Math.min(startPage + visiblePageCount, totalPages);

  return (
    <Container>
      <Header>
        <h2>게시판</h2>
        <CreateButton onClick={() => navigate("/create")}>글 작성</CreateButton>
      </Header>

      <CategoryContainer>
        <CategoryButton onClick={() => handleCategoryChange("")} $active={selectedCategory === ""}>
          전체
        </CategoryButton>
        {Object.entries(categories)
          .filter(([key]) => key !== "NOTICE")
          .map(([key, value]) => (
            <CategoryButton key={key} onClick={() => handleCategoryChange(key)} $active={selectedCategory === key}>
              {value}
            </CategoryButton>
          ))}
      </CategoryContainer>

      <Table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBoards.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                등록된 게시물이 없습니다.
              </td>
            </tr>
          ) : (
            <>
              {page === 0 && noticeBoards.map(({ id, title, createdAt }) => (
                <NoticeRow key={id} onClick={() => navigate(`/board/${id}`)}>
                  <td><NoticeTag>공지</NoticeTag></td>
                  <td>{title}</td>
                  <td>관리자</td>
                  <td>{new Date(createdAt).toLocaleDateString()}</td>
                </NoticeRow>
              ))}

              {paginatedBoards.map(({ id, title, createdAt }, index) => {
                const postNumber = filteredBoards.length - (startIndex + index);
                return (
                  <tr key={id} onClick={() => navigate(`/board/${id}`)}>
                    <td>{postNumber}</td>
                    <td>{title}</td>
                    <td>{name}</td>
                    <td>{new Date(createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </Table>

      <Pagination>
        <>
          {page > 0 && (
            <PageButton onClick={() => setPage(page - 1)}>{"<"}</PageButton>
          )}

          {totalPages > 0
            ? Array.from({ length: endPage - startPage }, (_, index) => startPage + index).map((pageNumber) => (
                <PageButton
                  key={pageNumber}
                  $active={pageNumber === page}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber + 1}
                </PageButton>
              ))
            :
              <PageButton $active>{1}</PageButton>}

          {page + 1 < totalPages && (
            <PageButton onClick={() => setPage(page + 1)}>{">"}</PageButton>
          )}
        </>
      </Pagination>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="검색어를 입력해주세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </SearchContainer>
    </Container>
  );
};

export default BoardList;

const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 10px;
    width: 95%;
  }
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

  th:nth-child(1), td:nth-child(1) {
    width: 8%;
    text-align: center;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 50%;
  }

  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4) {
    width: 20%;
    text-align: center;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const NoticeRow = styled.tr`
  background-color: #f8f9fa;
  font-weight: bold;
  &:hover {
    background-color: #e9ecef;
  }
`;

const NoticeTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  color: #ff4d4d;
  background-color: #ffe6e6;
  border: 1px solid #ff4d4d;
  border-radius: 5px;
  width: max-content;
  margin: 0 auto;
`;

const CreateButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #218838;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: none;
  background-color: ${({ $active }) => ($active ? "#007bff" : "#ddd")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#0056b3" : "#ccc")};
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: none;
  background-color: ${({ $active }) => ($active ? "#ddd" : "transparent")};
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #ddd;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

const SearchContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  padding: 8px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 150px;
    padding: 6px;
  }
`;

const SearchButton = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;