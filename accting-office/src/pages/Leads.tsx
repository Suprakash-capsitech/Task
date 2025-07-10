import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dropdown,
  IconButton,
  Pivot,
  PivotItem,
  SelectionMode,
  Spinner,
  Stack,
  Text,
  type IColumn,
  type IDropdownOption,
} from "@fluentui/react";
import CustomCommandBar from "../component/common/CustomCommandBar";
import { useEffect, useState } from "react";
import CustomBreadCrum from "../component/common/CustomBreadCrum";
import CreateLeadForm from "../component/CreateLeadForm";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { LeadsInterface } from "../types";
import { useNavigate } from "react-router-dom";
import LeadUpdateForm from "../component/LeadUpdateForm";
import { isAxiosError } from "axios";

const Leads = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [openModal, setopenModal] = useState<LeadsInterface>();

  const [search, setSearch] = useState<string>("");
  const [isloading, setisloading] = useState<boolean>(false);
  const [leads, setleads] = useState<LeadsInterface[]>([]);
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchParam, setSearchParam] = useState("getleads");

  const [itemperpage, setItemperpage] = useState<number>(5);
  const pageoption: IDropdownOption[] = [
    { key: 5, text: "5" },
    { key: 10, text: "10" },
    { key: 15, text: "15" },
    { key: 20, text: "20" },
  ];
  const ITEMS_PER_PAGE = itemperpage;
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedItems = leads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const refresh = () => {
    GetLeads();
  };
  const GetLeads = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate.get(`/Lead/${searchParam}`, {
        params: {
          search: search,
        },
      });

      if (response.data) {
        setleads(response.data);

        setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    GetLeads();
  }, [searchParam]);
  const handleTabClick = (item?: PivotItem) => {
    const key = item?.props.itemKey;
    if (key) {
      setSearchParam(key);
    }
  };

  const item = [
    { key: "home", text: "Home", href: "/" },
    { key: "lead", text: "Lead", href: "/lead" },
  ];
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
        onRender: (_item: LeadsInterface, index?: number) =>
          index !== undefined ? startIndex + index + 1 : "",
      },
      {
        key: "name",
        name: "Name",
        fieldName: "name",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        onColumnClick: onColumnClick,
        onRender: (item: LeadsInterface) => (
          <span
            style={{
              color: "#0078d4",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate(`/lead/${item.id}`)}
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
        minWidth: 80,
        isResizable: true,
        isSorted: false,
      },
      {
        key: "phone",
        name: "Phone Number",
        fieldName: "phone_Number",
        minWidth: 100,
        isResizable: true,
      },
      {
        key: "created_By",
        name: "Created By",
        fieldName: "created_By.name",
        minWidth: 100,
        isResizable: true,
        onRender: (item: LeadsInterface) => item.created_By?.name,
      },
      {
        key: "createdAt",
        name: "Created At",
        fieldName: "createdAt",
        minWidth: 120,
        isResizable: true,
        onColumnClick: onColumnClick,
        onRender: (item: LeadsInterface) =>
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
        minWidth: 80,
        maxWidth: 100,
        isResizable: false,
        onRender: (item: LeadsInterface) => (
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
                    `/Lead/deletelead/${item.id}`
                  );
                  if (response) {
                    GetLeads();
                  }
                } catch (error: unknown) {
                  if (isAxiosError(error)) {
                    alert(error.response?.data);
                  } else {
                    console.log(error);
                  }
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
  // Handle column sorting
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

    const sortedItems = [...leads].sort((a, b) => {
      const aVal = (a as any)[column.fieldName as string];
      const bVal = (b as any)[column.fieldName as string];

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      return isSortedDescending
        ? bVal.toString().localeCompare(aVal.toString())
        : aVal.toString().localeCompare(bVal.toString());
    });

    setleads(sortedItems);
    setColumns(newColumns);
    setCurrentPage(0);
  };
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const HandleSearch = () => {
    GetLeads();
  };
  return (
    <Stack>
      <CustomBreadCrum items={item} />

      <Pivot onLinkClick={handleTabClick} selectedKey={searchParam}>
        <PivotItem headerText="Lead" itemIcon="Contact" itemKey="getleads" />
        <PivotItem
          headerText="Contact"
          itemIcon="ContactInfo"
          itemKey="getcontacts"
        />
      </Pivot>

      <CreateLeadForm
        isFormOpen={isOpen}
        OpenForm={setisOpen}
        RefreshList={refresh}
      />
      <Stack tokens={{ padding: 5 }}>
        <CustomCommandBar
          handleSubmit={HandleSearch}
          SetSearch={setSearch}
          OpenForm={setisOpen}
          RefreshList={refresh}
        />
        <Stack tokens={{ childrenGap: 2 }} style={{ overflowY: "auto" }}>
          {isloading ? (
            <Spinner label="Loading " />
          ) : (
            <Stack tokens={{ childrenGap: 10 }}>
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
              {leads.length === 0 ? (
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
      </Stack>

      {openModal && (
        <LeadUpdateForm
          isFormOpen={!!openModal}
          value={openModal}
          OpenForm={setopenModal}
          RefreshList={refresh}
        />
      )}
    </Stack>
  );
};
export default Leads;
