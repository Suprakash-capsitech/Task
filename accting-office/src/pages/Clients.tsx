import { useEffect, useState } from "react";
import CustomCommandBar from "../component/common/CustomCommandBar";
import {
  DetailsList,
  DetailsListLayoutMode,
  Dropdown,
  IconButton,
  SelectionMode,
  Spinner,
  Stack,
  Text,
  type IColumn,
  type IDropdownOption,
} from "@fluentui/react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { ClientInterface } from "../types";
import { useNavigate } from "react-router-dom";
import CustomBreadCrum from "../component/common/CustomBreadCrum";
import CreateClientForm from "../component/CreateClientForm";
import { ClientTypeCnversion, StatusConversion } from "../utils/EnumtoString";
// import ClientUpdateForm from "../component/ClientUpdateForm";

const Clients = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filterType, setfilterType] = useState<string>("");
  const [filterValue, setfilterValue] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const [clientlist, setclientlist] = useState<ClientInterface[]>([]);
  // const [openModal, setopenModal] = useState<ClientInterface>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [itemperpage, setItemperpage] = useState<number>(10);
  const [totalPages, settotalPages] = useState<number>(0);
  const pageoption: IDropdownOption[] = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 15, text: "15" },
    { key: 20, text: "20" },
  ];

  const BreadCrumitem = [
    { key: "home", text: "Home", href: "/" },
    { key: "client", text: "Client", href: "/client" },
  ];
  const GetClients = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate("/Client/clients", {
        params: {
          search: search,
          filtertype: filterType,
          filtervalue: filterValue,
          pageNumber: currentPage + 1,
          pagesize: itemperpage,
        },
      });

      if (response.data) {
        setclientlist(response.data.clientList);
        settotalPages(Math.ceil(response.data.totalCount / itemperpage));
        setisloading(false);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setisloading(false);
    }
  };
  const refresh = () => {
    GetClients();
  };

  useEffect(() => {
    GetClients();
  }, [filterValue, itemperpage, currentPage]);
  useEffect(() => {
    const initialColumns: IColumn[] = [
      {
        key: "serial",
        name: "S.No.",
        fieldName: "serial",
        minWidth: 80,
        maxWidth: 90,
        isResizable: false,
        isSorted: false,
        isSortedDescending: false,
        onRender: (_item: ClientInterface, index?: number) =>
          index !== undefined ? currentPage * itemperpage + index + 1 : "",
      },
      {
        key: "name",
        name: "Business Name",
        fieldName: "name",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        onRender: (item: ClientInterface) => (
          <Text
            style={{
              color: "#0078d4",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate(`/client/${item.id}`)}
          >
            {item.name}
          </Text>
        ),
      },
      {
        key: "email",
        name: "Email",
        fieldName: "email",
        minWidth: 180,
        isResizable: true,
        isSorted: false,
      },
      {
        key: "type",
        name: "Type",
        fieldName: "type",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        onRender: (item: ClientInterface) => {
          return <Text>{ClientTypeCnversion[item.type as number]}</Text>;
        },
      },
      {
        key: "address",
        name: "Address",
        fieldName: "address",
        minWidth: 150,
        isResizable: true,
        onRender: (item: ClientInterface) => item.address.area,
      },
      {
        key: "contact_person",
        name: "Contact Person",
        // fieldName: "created_Details",
        minWidth: 150,
        isResizable: true,
        onRender: (item: ClientInterface) => (
          <Text
            onClick={() => navigate(`/lead/${item?.contactDetails[0]?.id}`)}
            style={{
              color: "#0078d4",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {item?.contactDetails ? item?.contactDetails[0]?.name : ""}
          </Text>
        ),
      },
      {
        key: "created_By",
        name: "Created By",
        fieldName: "createdBy.name",
        minWidth: 150,
        isResizable: true,
        onRender: (item: ClientInterface) => item.createdBy?.name,
      },
      {
        key: "createdAt",
        name: "Created At",
        fieldName: "createdAt",
        minWidth: 150,
        isResizable: true,
        onRender: (item: ClientInterface) =>
          new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
      },
      {
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 100,
        isResizable: true,
        onRender: (item: ClientInterface) => (
          <Text
            style={{
              color:
                item.status === 1 ? " rgb(16, 124, 16)" : "rgb(50, 49, 48)",
              backgroundColor:
                item.status === 1 ? "rgb(223, 246, 221)" : "rgb(255, 244, 206)",
              padding: "4px 8px",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            {StatusConversion[item.status]}
          </Text>
        ),
      },
    ];
    setColumns(initialColumns);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [itemperpage]);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <Stack tokens={{ maxHeight: "90vh" }}>
      <CustomBreadCrum items={BreadCrumitem} />
      <CustomCommandBar
        handleSubmit={refresh}
        SetSearch={setSearch}
        OpenForm={setisOpen}
        RefreshList={refresh}
        setFilterType={setfilterType}
        setFilterValue={setfilterValue}
        showFilter={true}
      />
      {isOpen && (
        <CreateClientForm
          isFormOpen={isOpen}
          OpenForm={setisOpen}
          RefreshList={refresh}
        />
      )}

      <Stack
        tokens={{ childrenGap: 5 }}
        style={{
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(218, 218, 218) ",
        }}
      >
        {isloading ? (
          <Spinner label="Loading " />
        ) : (
          <Stack tokens={{ childrenGap: 10, padding: 5 }}>
            <DetailsList
              items={clientlist}
              columns={columns}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
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
              styles={{
                root: {
                  fontWeight: "thin",
                },
                headerWrapper: {
                  fontWeight: "thin",
                },
              }}
              onRenderRow={(props, defaultRender) => {
                if (!props || !defaultRender) return null;

                const isEven = props.itemIndex % 2 === 0;

                return defaultRender({
                    ...props,
                    styles: {
                      root: {
                        fontWeight: "thin",
                        padding: 0,
                        margin: 0,
                        fontSize: 11,
                        lineHeight: 10,
                        alignContent: "center",
                        backgroundColor: isEven ? "#f9f9f9" : "white", // stripe effect
                        selectors: {
                          ":hover": {
                            backgroundColor: "#eaeaea", // optional hover
                          },
                        },
                      },
                    },
                  });
              }}
            />
            {clientlist.length === 0 ? (
              <Stack
                styles={{
                  root: {
                    alignItems: "center",
                  },
                }}
              >
                <Text>No Content</Text>
              </Stack>
            ) : (
              <Stack
                horizontal
                horizontalAlign="space-between"
                tokens={{ childrenGap: 12, padding: 5 }}
                verticalAlign="center"
              >
                <Stack>
                  <Dropdown
                    selectedKey={itemperpage}
                    onChange={(_event, option) => {
                      if (option) {
                        setItemperpage(option.key as number);
                      }
                    }}
                    options={pageoption}
                    styles={{
                      title: {
                        border: "1px solid rgba(0,0,0,.2)",

                        borderRadius: 6,
                      },
                      callout: {
                        borderRadius: 5,
                      },
                      dropdown: {
                        border: "none",
                        outline: "none",
                      },
                    }}
                  />
                </Stack>
                <Stack horizontal tokens={{ childrenGap: 8 }}>
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
              </Stack>
            )}
          </Stack>
        )}
      </Stack>

      {/* {openModal && (
        <ClientUpdateForm
          isFormOpen={!!openModal}
          value={openModal}
          OpenForm={setopenModal}
          RefreshList={refresh}
        />
      )} */}
    </Stack>
  );
};

export default Clients;
