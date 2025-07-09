import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  IconButton,
  SelectionMode,
  Stack,
  Text,
  type IColumn,
} from "@fluentui/react";
import type { LeadsInterface } from "../types";
import { useEffect, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
interface ContactPivotProps {
  data: LeadsInterface[];
}
const ContactPivot: FC<ContactPivotProps> = ({ data }) => {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  const axiosPrivate = useAxiosPrivate();
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
        key: "status",
        name: "Status",
        fieldName: "status",
        minWidth: 100,
        isResizable: true,
        onRender: (item: LeadsInterface) => (
          <Text
            style={{
              color:
                item.status === "active"
                  ? " rgb(16, 124, 16)"
                  : "rgb(50, 49, 48)",
              backgroundColor:
                item.status === "active"
                  ? "rgb(223, 246, 221)"
                  : "rgb(255, 244, 206)",
              padding: "4px 8px",
              borderRadius: 4,
              display: "inline-block",
            }}
          >
            {item.status}
          </Text>
        ),
      },

      {
        key: "createdAt",
        name: "Created At",
        fieldName: "createdAt",
        minWidth: 120,
        isResizable: true,
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
            <DefaultButton
              iconProps={{ iconName: "Removelink" }}
              title="Delete"
              ariaLabel="Delete"
              styles={{ root: { minWidth: 32, padding: 4, border: 0 } }}
              onClick={async () => {
                try {
                  const response = await axiosPrivate.put(
                    `/Client/unlinklead/${path}?lead_id=${item.id}`
                  );
                  if (response) {
                    console.log(response.data);
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
  }, [startIndex]);

  return (
    <Stack>
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
        {data.length === 0 ? (
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

            <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 8 }}>
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
    </Stack>
  );
};

export default ContactPivot;
