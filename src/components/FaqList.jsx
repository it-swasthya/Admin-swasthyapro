import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Typography, TextField, TablePagination
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import {changeNavValue} from "../Redux/reducer"
const highlightMatch = (text, query) => {
  if (!query) return text;
  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    const parts = String(text).split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
       <mark
          key={i}
          style={{
            background: "linear-gradient(90deg, #f7b733, #fc4a1a)",
            color: "white",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch (err) {
    return text;
  }
};

const columns = [
      { id: 'facility_id', label: 'Facility ID', minWidth: 130 },
        { id: 'test_id', label: 'Test ID', minWidth: 100 },
  { id: 'faq_ques', label: 'Question', minWidth: 170 },
  { id: 'faq_ans', label: 'Answer', minWidth: 170 },
  { id: 'createdAt', label: 'Created At', minWidth: 160 },
];

export default function FaqTable() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
 const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(changeNavValue("FAQ's"))
    const fetchFAQs = async () => {
      try {
        const res = await axios.get('https://api.swasthyapro.com/api/faq/all-faq');
        const data = res.data.data;
        setFaqs(data);
        setFilteredFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

 const handleSearch = (e) => {
  const rawValue = e.target.value;
  const value = rawValue.trim().toLowerCase().replace(/\s+/g, " "); 
  setSearchTerm(rawValue); 
  if (!value) {
    setFilteredFaqs(faqs);
    return;
  }

  const filtered = faqs.filter((faq) => {
    const ques = faq.faq_ques?.toLowerCase().replace(/\s+/g, " ") || "";
    const ans = faq.faq_ans?.toLowerCase().replace(/\s+/g, " ") || "";
    const testId = String(faq.test_id || "");
    const facilityId = String(faq.facility_id || "");

    return (
      ques.includes(value) ||
      ans.includes(value) ||
      testId.includes(value) ||
      facilityId.includes(value)
    );
  });

  setFilteredFaqs(filtered);
  setPage(0);
};


  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' ,paddingBottom:1 ,paddingTop:1 }}>

      <TextField
        
        label="Search FAQs"
          variant="outlined"
          size="small"
          value={searchTerm}
        onChange={handleSearch}
        sx={{ mx: 2, mb: 2 }}
      />

      {loading ? (
        <CircularProgress sx={{ m: 4 }} />
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400,
              overflowY: 'scroll',
              '&::-webkit-scrollbar': { display: 'none' },
              '-ms-overflow-style': 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Table stickyHeader sx={{ minWidth: 1200 }} aria-label="faq table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        background: "linear-gradient(90deg, #4b6cb7, #182848)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        padding: "3px",
                        borderBottom: "none",
                      }}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredFaqs.length > 0 ? (
                  filteredFaqs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row._id} sx={{ height: 36 }}>
                        {columns.map((column) => {
                          const value =
                            column.id === 'createdAt'
                              ? new Date(row[column.id]).toLocaleString()
                              : row[column.id];

                          return (
                            <TableCell
                              key={column.id}
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(value, searchTerm)}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No FAQs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredFaqs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
}
