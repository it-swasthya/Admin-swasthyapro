import React, { useEffect, useState } from "react";

import axios from "axios";
import StatusFormModal from "../../components/query-table-component/ChangeQueryStatus";
import { useDispatch } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";
import { getQueryTableColumns } from "../../components/columns/QueryColumn";
import TableComponent from "../../components/table/Table";
import flattenQueryRow from "../../utils/UsersQueryFlattenRow";
import { changeNavValue } from "../../Redux/reducer";
import UserQueryModal from "../../components/user-query-modal/UserQueryModal";
import { MobileViewQuery } from "../../mobile-components/user-query/MobileViewQuery";

const Query = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const [openQueryUpdateFrom, setOpenQueryUpdateFrom] = useState(false);
  const [addQueryOpen, setAddQueryOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [newQuery, setNewQuery] = useState({
    User_id: null,
    phone: null,
    name: "",
    email: "",
    query: "",
  });
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.swasthyapro.com/api/query/get-user-query"
      );
      setData(response.data.data || []);
      setFilteredData(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("User Query"));
    getQueries();
  }, []);

  const onInfoClick = (query) => {
    setSelectedQuery(query);
    setOpen(true);
  };

  const handleShowForm = (row) => {
    setSelectedQueryId(row);
    setOpenQueryUpdateFrom(true);
  };
  const column = getQueryTableColumns({
    onUpdateClick: handleShowForm,
    onInfoClick: onInfoClick,
  });

  return (
    <>
      {isMobile ? (
        <MobileViewQuery
          data={data}
          filteredData={filteredData}
          handleShowForm={handleShowForm}
        />
      ) : (
        <TableComponent
          columns={column}
          data={data}
          flattenRow={flattenQueryRow}
          filename={"user-query-file"}
        />
      )}

      {openQueryUpdateFrom && (
        <StatusFormModal
          open={openQueryUpdateFrom}
          onClose={() => setOpenQueryUpdateFrom(false)}
          row={selectedQueryId}
          getQueries={getQueries}
        />
      )}

      {open && (
        <UserQueryModal
          open={open}
          handleClose={() => setOpen(false)}
          query={selectedQuery}
        />
      )}
    </>
  );
};

export { Query };
