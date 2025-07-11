import { useEffect, useState } from "react";
import CustomCommandBar from "../component/common/CustomCommandBar";
import {
  DefaultButton,
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
// import ClientUpdateForm from "../component/ClientUpdateForm";

const Clients = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filterType, setfilterType] = useState<string>("");
  const [filterValue, setfilterValue] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const [clientlist, setclientlist] = useState<ClientInterface[]>([]);
  // const [openModal, setopenModal] = useState<ClientInterface>();
  const [currentPage, setCurrentPage] = useState(0);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [itemperpage, setItemperpage] = useState<number>(5);
  const pageoption: IDropdownOption[] = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 15, text: "15" },
    { key: 20, text: "20" },
  ];
  const ITEMS_PER_PAGE = itemperpage;
  const totalPages = Math.ceil(clientlist.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedItems = clientlist.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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
        },
      });

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
  const refresh = () => {
    GetClients();
  };

  useEffect(() => {
    GetClients();
  }, [filterValue]);
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
            onClick={() => navigate(`/lead/${item?.contact_Details[0]?.id}`)}
            style={{
              color: "#0078d4",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {item?.contact_Details ? item?.contact_Details[0]?.name : ""}
          </Text>
        ),
      },
      {
        key: "created_By",
        name: "Created By",
        fieldName: "created_By.name",
        minWidth: 150,
        isResizable: true,
        onRender: (item: ClientInterface) => item.created_By?.name,
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
        key: "actions",
        name: "Actions",
        fieldName: "actions",
        minWidth: 150,

        isResizable: true,
        onRender: (item: ClientInterface) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            {/* <DefaultButton
              iconProps={{ iconName: "Edit" }}
              title="Edit"
              ariaLabel="Edit"
              styles={{ root: { minWidth: 32, padding: 4, border: 0 } }}
              onClick={() => setopenModal(item)}
            /> */}
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
  }, [startIndex, itemperpage]);

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
              items={paginatedItems}
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
              <></>
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
