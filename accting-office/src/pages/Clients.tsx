import { useEffect, useState } from "react";
import CustomCommandBar from "../component/common/CustomCommandBar";
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  IconButton,
  Panel,
  PanelType,
  SelectionMode,
  Spinner,
  Stack,
  Text,
  type IColumn,
} from "@fluentui/react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { ClientInterface } from "../types";
import { useNavigate } from "react-router-dom";
import CustomBreadCrum from "../component/common/CustomBreadCrum";
import CreateClientForm from "../component/CreateClientForm";
import ClientUpdateForm from "../component/ClientUpdateForm";

const Clients = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [isloading, setisloading] = useState<boolean>(false);
  const [clientlist, setclientlist] = useState<ClientInterface[]>([]);

  const [openModal, setopenModal] = useState<ClientInterface>();
  const [currentPage, setCurrentPage] = useState(0);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(clientlist.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedItems = clientlist.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const refresh = () => {
    GetClients();
  };

  const BreadCrumitem = [
    { key: "home", text: "Home", href: "/" },
    { key: "client", text: "Client", href: "/client" },
  ];
  const GetClients = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate("/Client/clients");

      if (response.data) {
        setclientlist(response.data);
        setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    GetClients();
  }, []);
  useEffect(() => {
    const initialColumns: IColumn[] = [
      {
        key: "serial",
        name: "S.No.",
        fieldName: "serial",
        minWidth: 50,
        maxWidth: 60,
        isResizable: false,
        isSorted: false,
        isSortedDescending: false,
        onColumnClick: onColumnClick,
        onRender: (_item: ClientInterface, index?: number) =>
          index !== undefined ? startIndex + index + 1 : "",
      },
      {
        key: "name",
        name: "Business Name",
        fieldName: "name",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        onColumnClick: onColumnClick,
        onRender: (item: ClientInterface) => (
          <span
            style={{
              color: "#0078d4",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate(`/client/${item.id}`)}
          >
            {item.name}
          </span>
        ),
      },
      {
        key: "email",
        name: "Email",
        fieldName: "email",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        onColumnClick: onColumnClick,
      },
      {
        key: "type",
        name: "Type",
        fieldName: "type",
        minWidth: 120,
        isResizable: true,
        isSorted: false,
      },
      {
        key: "address",
        name: "Address",
        fieldName: "address",
        minWidth: 120,
        isResizable: true,
      },
      {
        key: "created_By",
        name: "Created By",
        fieldName: "created_By.name",
        minWidth: 120,
        isResizable: true,
        onRender: (item: ClientInterface) => item.created_By?.name,
      },
      {
        key: "createdAt",
        name: "Created At",
        fieldName: "createdAt",
        minWidth: 120,
        isResizable: true,
        // onColumnClick: onColumnClick,
        onRender: (item: ClientInterface) =>
          new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        key: "actions",
        name: "Actions",
        fieldName: "actions",
        minWidth: 120,

        isResizable: true,
        onRender: (item: ClientInterface) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <DefaultButton
              iconProps={{ iconName: "Edit" }}
              title="Edit"
              ariaLabel="Edit"
              styles={{ root: { minWidth: 32, padding: 4, border: 0 } }}
              onClick={() => setopenModal(item)}
            />
            <DefaultButton
              iconProps={{ iconName: "Delete" }}
              title="Delete"
              ariaLabel="Delete"
              styles={{ root: { minWidth: 32, padding: 4, border: 0 } }}
              onClick={async () => {
                try {
                  const response = await axiosPrivate.delete(
                    `/Client/deleteclient/${item.id}`
                  );
                  if (response) {
                    GetClients();
                  }
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </Stack>
        ),
      },
    ];
    setColumns(initialColumns);
  }, [startIndex]);
  const onColumnClick = (
    _ev?: React.MouseEvent<HTMLElement>,
    column?: IColumn
  ): void => {
    if (!column) return;

    const isSortedDescending = !column.isSortedDescending;
    const newColumns = columns.map((col) => ({
      ...col,
      isSorted: col.key === column.key,
      isSortedDescending: col.key === column.key ? isSortedDescending : false,
    }));

    const sortedItems = [...clientlist].sort((a, b) => {
      const aVal = (a as any)[column.fieldName as string];
      const bVal = (b as any)[column.fieldName as string];

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      return isSortedDescending
        ? bVal.toString().localeCompare(aVal.toString())
        : aVal.toString().localeCompare(bVal.toString());
    });

    setclientlist(sortedItems);
    setColumns(newColumns);
    setCurrentPage(0);
  };
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <Stack>
      <CustomBreadCrum items={BreadCrumitem} />
      <CustomCommandBar OpenForm={setisOpen} RefreshList={refresh} />
      <Panel
        headerText="Add Client"
        isOpen={isOpen}
        onDismiss={() => setisOpen(false)}
        closeButtonAriaLabel="Close"
        type={PanelType.medium}
      >
        <CreateClientForm OpenForm={setisOpen} RefreshList={refresh} />
      </Panel>
      <Stack
        tokens={{ childrenGap: 5, padding: 5 }}
        style={{
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(218, 218, 218) ",
        }}
      >
        {isloading ? (
          <Spinner label="Loading " />
        ) : (
          <Stack tokens={{ childrenGap: 10, padding: 5 }}>
            <DetailsList
              items={paginatedItems}
              columns={columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.fixedColumns}
              selectionMode={SelectionMode.none}
              isHeaderVisible={true}
              columnReorderOptions={{
                frozenColumnCountFromStart: 0,
                frozenColumnCountFromEnd: 0,
                handleColumnReorder: (draggedIndex, targetIndex) => {
                  const newColumns = [...columns];
                  const [dragged] = newColumns.splice(draggedIndex, 1);
                  newColumns.splice(targetIndex, 0, dragged);
                  setColumns(newColumns);
                },
              }}
            />
            {clientlist.length === 0 ? (
              <></>
            ) : (
              <Stack
                horizontal
                horizontalAlign="end"
                tokens={{ childrenGap: 12 }}
                verticalAlign="center"
              >
                <IconButton
                  iconProps={{ iconName: "ChevronLeft" }}
                  title="Previous"
                  ariaLabel="Previous"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                />

                <Stack
                  horizontal
                  verticalAlign="end"
                  tokens={{ childrenGap: 8 }}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Text
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      style={{
                        cursor: "pointer",
                        fontWeight: currentPage === i ? "bold" : "normal",
                        color: currentPage === i ? "#0078D4" : "#333",
                        padding: "4px 6px",
                        borderRadius: 4,
                        backgroundColor:
                          currentPage === i ? "#e5f1fb" : "transparent",
                      }}
                    >
                      {i + 1}
                    </Text>
                  ))}
                </Stack>

                <IconButton
                  iconProps={{ iconName: "ChevronRight" }}
                  title="Next"
                  ariaLabel="Next"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                />
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
      <Panel
        headerText="Update Client"
        isOpen={!!openModal}
        onDismiss={() => setopenModal(undefined)}
        type={PanelType.medium}
        isLightDismiss={true}
        closeButtonAriaLabel="Close"
        isFooterAtBottom={true}
      >
        {openModal && (
          <ClientUpdateForm
            value={openModal}
            OpenForm={setopenModal}
            RefreshList={refresh}
          />
        )}
      </Panel>
    </Stack>
  );
};

export default Clients;
