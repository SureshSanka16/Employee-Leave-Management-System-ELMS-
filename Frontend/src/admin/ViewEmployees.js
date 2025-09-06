import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from "@nextui-org/react";
import { columns, statusOptions } from "./tableutils/data";
import { capitalize } from "./tableutils/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PlusIcon } from "./tableutils/PlusIcon";
import { VerticalDotsIcon } from "./tableutils/VerticalDotsIcon";
import { SearchIcon } from "./tableutils/SearchIcon";
import { ChevronDownIcon } from "./tableutils/ChevRonDownIcon";
import axios from "axios";
import BackendURLS from "./../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import exportFromJSON from "export-from-json";
import * as XLSX from "xlsx";
import "./style.View.css";

const statusColorMap = {
  active: "success",
  inactive: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "EmployeeID",
  "EmployeeName",
  "EmployeeDepartment",
  "EmployeeStatus",
  "actions",
];

export default function ViewEmployees() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const [SBox, setSBox] = useState(false);
  const [DBox, setDBox] = useState(false);
  const [empIDS, setEmpIDS] = useState("");
  const [empIDD, setEmpIDD] = useState("");
  const [profiles, setProfiles] = useState({});
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({ column: "name", direction: "ascending" });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  // Fetch users and their profiles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BackendURLS.Admin}/viewEmployees`, {
          headers: { Authorization: sessionStorage.getItem("AdminToken") },
        });

        setUsers1(response.data);

        const usersWithProfiles = await Promise.all(
          response.data.map(async (user) => {
            try {
              const res = await axios.get(`${BackendURLS.Admin}/viewProfile/${user.EmployeeID}`, {
                headers: { Authorization: sessionStorage.getItem("AdminToken") },
                responseType: "arraybuffer",
              });
              const base64 = btoa(
                new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
              );
              return { ...user, profile: `data:image/jpeg;base64,${base64}` };
            } catch {
              return { ...user, profile: "" };
            }
          })
        );

        setUsers(usersWithProfiles);
        const profileObj = {};
        usersWithProfiles.forEach(u => { profileObj[u.EmployeeID] = u.profile; });
        setProfiles(profileObj);

        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching data:", e);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSbox = (empID) => { setSBox(true); setEmpIDS(empID); };
  const handleDBox = (empID) => { setDBox(true); setEmpIDD(empID); };

  const handleStatus = async (empID) => {
    try {
      const response = await axios.put(`${BackendURLS.Admin}/changeStatus/${empID}`, null, {
        headers: { Authorization: sessionStorage.getItem("AdminToken") },
      });
      if (response.status === 200) {
        toast.success("Employee Status Changed!", { theme: "colored" });
        setSBox(false);
        setEmpIDS("");
        setIsLoading(true);
        const res = await axios.get(`${BackendURLS.Admin}/viewEmployees`, { headers: { Authorization: sessionStorage.getItem("AdminToken") } });
        setUsers(res.data);
        setUsers1(res.data);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleDelete = async (empID) => {
    try {
      const response = await axios.delete(`${BackendURLS.Admin}/deleteEmployee/${empID}`, {
        headers: { Authorization: sessionStorage.getItem("AdminToken") },
      });
      if (response.status === 200) {
        toast.success("Employee Deleted!", { theme: "colored" });
        setDBox(false);
        const res = await axios.get(`${BackendURLS.Admin}/viewEmployees`, { headers: { Authorization: sessionStorage.getItem("AdminToken") } });
        setUsers(res.data);
        setUsers1(res.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const exportToCSV = useCallback(() => {
    exportFromJSON({ data: users1, filename: Date.now(), exportType: exportFromJSON.types.csv });
  }, [users1]);

  const exportToCSV_A = useCallback(() => {
    const activeUsers = users1.filter(user => user.EmployeeStatus === "Active");
    exportFromJSON({ data: activeUsers, filename: Date.now(), exportType: exportFromJSON.types.csv });
  }, [users1]);

  const exportToExcel = useCallback(() => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(users1), "Sheet-1");
    XLSX.writeFile(wb, "EmployeeData.xlsx");
  }, [users1]);

  const exportToExcel_A = useCallback(() => {
    const activeUsers = users1.filter(user => user.EmployeeStatus === "Active");
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activeUsers), "Sheet-1");
    XLSX.writeFile(wb, "EmployeeData(Active).xlsx");
  }, [users1]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...users];
    if (hasSearchFilter) {
      filtered = filtered.filter(u => u.EmployeeName?.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter && statusFilter.length > 0 && statusFilter.length !== statusOptions.length) {
      filtered = filtered.filter(u => statusFilter.includes(u.EmployeeStatus?.toLowerCase()));
    }
    return filtered;
  }, [users, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "EmployeeName":
        return <User avatarProps={{ size: "lg", src: profiles[user.EmployeeID] }} description={user.EmployeeMailID} name={user.EmployeeName} />;
      case "EmployeeStatus":
        return <Chip className="capitalize" color={statusColorMap[user.EmployeeStatus.toLowerCase()]} size="sm" variant="flat">{cellValue}</Chip>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown aria-label="VerticalDots">
              <DropdownTrigger>
                <Button aria-label="VerticalDots" isIconOnly size="sm" variant="light"><VerticalDotsIcon /></Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => navigate(`/admin/viewEmployee/${user.EmployeeID}`)}>View</DropdownItem>
                <DropdownItem onClick={() => navigate(`/admin/UpdateEmployee/${user.EmployeeID}`)}>Edit</DropdownItem>
                <DropdownItem color="danger" variant="shadow" onClick={() => handleDBox(user.EmployeeID)}>Delete</DropdownItem>
                <DropdownItem onClick={() => handleSbox(user.EmployeeID)}>SetStatus</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [profiles, navigate]);

  const onNextPage = useCallback(() => page < pages && setPage(page + 1), [page, pages]);
  const onPreviousPage = useCallback(() => page > 1 && setPage(page - 1), [page]);

  const onRowsPerPageChange = useCallback((e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }, []);
  const onSearchChange = useCallback((value) => { setFilterValue(value || ""); setPage(1); }, []);
  const onClear = useCallback(() => { setFilterValue(""); setPage(1); }, []);

  const topContent = useMemo(() => (
    <div>
      <br />
      <div className="flex flex-col gap-10 ml-2 mt-9">
        <div className="flex justify-between gap-3 items-end">
          <Input isClearable className="w-full sm:max-w-[44%]" placeholder="Search by name..." startContent={<SearchIcon />} value={filterValue} onClear={onClear} onValueChange={onSearchChange} />
          <div className="flex gap-3 mr-2">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">Status</Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect selectedKeys={statusFilter} selectionMode="multiple" onSelectionChange={setStatusFilter}>
                {statusOptions.map(status => <DropdownItem key={status.uid} className="capitalize">{capitalize(status.name)}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">Columns</Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns}>
                {columns.map(column => <DropdownItem key={column.uid} className="capitalize">{capitalize(column.name)}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onClick={() => navigate(`/admin/addemployee`)} endContent={<PlusIcon />}>Add New</Button>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">Download</Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={exportToCSV_A}>Export As CSV(Active)</DropdownItem>
                <DropdownItem onClick={exportToExcel_A}>Export As Excel(Active)</DropdownItem>
                <DropdownItem onClick={exportToCSV}>Export As CSV</DropdownItem>
                <DropdownItem onClick={exportToExcel}>Export As Excel</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center" style={{ color: "black" }}>
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  ), [filterValue, statusFilter, visibleColumns, users.length, onRowsPerPageChange, onSearchChange, exportToCSV, exportToCSV_A, exportToExcel, exportToExcel_A, navigate, onClear]);

  const bottomContent = useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {selectedKeys === "all" ? "All items selected" : `${selectedKeys.size} of ${filteredItems.length} selected`}
      </span>
      <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage} style={{ backgroundColor: "white" }}>Previous</Button>
        <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage} style={{ backgroundColor: "white" }}>Next</Button>
      </div>
    </div>
  ), [selectedKeys, page, pages, filteredItems.length, onNextPage, onPreviousPage]);

  const spinnerContainerStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" };
  if (isLoading) return <div style={spinnerContainerStyle}><Spinner label="Loading..." color="warning" size="lg" /></div>;

  return (
    <div className="mx-4">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{ wrapper: "max-h-[382px]" }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => <TableRow key={item.EmployeeID}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>

      <Modal backdrop="blur" isOpen={SBox} onClose={() => setSBox(false)}>
        <ModalContent>{(onClose) => (
          <>
            <ModalHeader>Change Status</ModalHeader>
            <ModalBody>Are you sure you want to change the status of the employee (ID : {empIDS})?</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
              <Button color="primary" onPress={() => handleStatus(empIDS)}>Confirm</Button>
            </ModalFooter>
          </>
        )}</ModalContent>
      </Modal>

      <Modal backdrop="blur" isOpen={DBox} onClose={() => setDBox(false)}>
        <ModalContent>{(onClose) => (
          <>
            <ModalHeader>Delete Employee</ModalHeader>
            <ModalBody>Are you sure you want to delete employee (ID : {empIDD})?</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
              <Button color="primary" onPress={() => handleDelete(empIDD)}>Confirm</Button>
            </ModalFooter>
          </>
        )}</ModalContent>
      </Modal>
    </div>
  );
}
