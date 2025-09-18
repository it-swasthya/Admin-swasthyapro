// utils/flattenQueryRow.js

const flattenQueryRow = (row) => ({
  Query_ID: row.id || '',
  User_Type: row.User_id ? 'User' : 'Guest',
  Name: row.name || '',
  Email: row.email || '',
  Phone: row.phone || '',
  Query: row.query || '',
  Status: row.status || '',
  Seen: row.seen ? 'Seen' : 'Not Seen',
  Remarks: row.remarks || '',
  Assigned_To: row.assignedTo || '',
  Created_At: row.createdAt
    ? new Date(row.createdAt).toLocaleString()
    : '',
});

export default flattenQueryRow;









