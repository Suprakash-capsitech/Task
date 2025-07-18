import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { StatsCharts, UserDataStats } from "../types";
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
import CustomBreadCrum from "../component/common/CustomBreadCrum";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const [userData, setuserData] = useState<UserDataStats[]>([]);
  const [userDataChart, setuserDataChart] = useState<UserDataStats[]>([]);
  const [statsDataChart, setstatsDataChart] = useState<StatsCharts[]>([]);
  const [period, setperiod] = useState<string>("this-month");
  const [isloading, setisloading] = useState<boolean>(false);
  const [columns, setColumns] = useState<IColumn[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, settotalPages] = useState<number>(0);
  const axiosPrivate = useAxiosPrivate();
  const BreadCrumitem = [{ key: "home", text: "Home", href: "/" }];
  const tableoption: IDropdownOption[] = [
    { key: "this-month", text: "This Month" },
    { key: "last-month", text: "Last Month" },
  ];

  const GetUserDataStats = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate.get("/Dashboard/getuserdata", {
        params: {
          period: period,
          pageSize: 3,
          pageNumber: currentPage + 1,
        },
      });
      if (response.data) {
        setuserData(response.data.userList);

        settotalPages(Math.ceil(response.data.totalCount / 5));
        setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };
  const GetUserDataStatsChart = async () => {
    // setisloading(true);
    try {
      const response = await axiosPrivate.get("/Dashboard/getuserdata", {
        params: {
          period: period,
        },
      });
      if (response.data) {
        setuserDataChart(response.data.userList);
        // setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setisloading(false);
    }
  };
  const GetChatsStats = async () => {
    // setisloading(true);
    try {
      const response = await axiosPrivate.get("/Dashboard/getstats", {
        params: {
          period: period,
        },
      });
      if (response.data) {
        setstatsDataChart(response.data);
        // setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setisloading(false);
    }
  };
  useEffect(() => {
    GetUserDataStats();
  }, [period, currentPage]);
  useEffect(() => {
    GetUserDataStatsChart();
    GetChatsStats();
  }, [period]);
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
        onRender: (_item: UserDataStats, index?: number) =>
          index !== undefined ? currentPage * 3 + index + 1 : "",
      },
      {
        key: "name",
        name: "User Name",
        fieldName: "name",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,

      },
      {
        key: "lead",
        name: "Leads Created",
        fieldName: "leadCount",
        minWidth: 180,
        isResizable: true,
        isSorted: false,
      },
      {
        key: "contact",
        name: "Contacts Created",
        fieldName: "contactCount",
        minWidth: 150,
        isResizable: true,
        isSorted: false,
      },
      {
        key: "client",
        name: "Clients Created",
        fieldName: "clientCount",
        minWidth: 150,
        isResizable: true,
      },
    ];
    setColumns(initialColumns);
  }, [currentPage]);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <Stack tokens={{ maxHeight: "94vh" }}>
      <CustomBreadCrum items={BreadCrumitem} />

      <Stack
        style={{
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(218, 218, 218) ",
        }}
      >
        <Stack
          horizontalAlign="end"
          styles={{
            root: {
              padding: 5,
              // paddingRight:10,
            },
          }}
        >
          <Dropdown
            selectedKey={period}
            onChange={(_event, option) => {
              if (option) {
                setperiod(option.key as string);
              }
            }}
            options={tableoption}
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
        {isloading ? (
          <Spinner label="Loading " />
        ) : (
          <Stack>
            <Stack tokens={{ childrenGap: 10 }}>
              <DetailsList
                items={userData}
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
              {userData.length === 0 ? (
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
                  horizontalAlign="end"
                  tokens={{ childrenGap: 12, padding: 5 }}
                  verticalAlign="center"
                >
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
          </Stack>
        )}
        <Stack
          styles={{
            root: { overflow: "hidden", minWidth: "100%", paddingLeft: 8 },
          }}
        >
          <Text>Total Stats:</Text>
          <ResponsiveContainer  height={250}>
            <AreaChart
              data={statsDataChart}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
              style={{border:"none", outline:"none"}}
            >
              <defs>
                <linearGradient
                  id="contactGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="20%"
                    stopColor="rgba(136, 132, 216, 1)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="85%"
                    stopColor="rgba(255, 255, 255, 1)"
                    stopOpacity={0.41}
                  />
                </linearGradient>
                <linearGradient id="clientGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#7ac273ff" stopOpacity={1} />
                  <stop
                    offset="85%"
                    stopColor="rgba(255, 255, 255, 1)"
                    stopOpacity={0.41}
                  />
                </linearGradient>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="20%"
                    stopColor="rgba(132, 182, 216, 1)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="85%"
                    stopColor="rgba(255, 255, 255, 1)"
                    stopOpacity={0.41}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 0" vertical={false} />
              <XAxis
                dataKey="id"
                interval={0}
                tickSize={4}
                tickMargin={10}
                fontSize={9}
              />
              <YAxis tickSize={4} tickMargin={10} interval={0} fontSize={9} />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                layout="horizontal"
                iconSize={10}
                iconType="circle"
              />
              <Area
                dot={{ stroke: "#84b6d8ff", strokeWidth: 1, fill: "white" }}
                name="Lead"
                type="monotone"
                dataKey="leadCount"
                stroke="#5ba5d6ff"
                fill="url(#leadGradient)"
                strokeWidth={2}
              />
              <Area
                dot={{ stroke: "#8884d8", strokeWidth: 1, fill: "white" }}
                name="Contact"
                type="monotone"
                dataKey="contactCount"
                stroke="#746fd8ff"
                fill="url(#contactGradient)"
                strokeWidth={2}
              />
              <Area
                dot={{ stroke: "#7ac273ff", strokeWidth: 1, fill: "white" }}
                name="Client"
                type="monotone"
                dataKey="clientCount"
                stroke="#2ea023ff"
                fill="url(#clientGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Stack>
        <Stack
          styles={{
            root: {  overflow: "hidden", minWidth: "100%", paddingLeft: 8 },
          }}
        >
          <Text>User wise total Stats:</Text>
          <ResponsiveContainer height={300} >
            <BarChart
              data={userDataChart}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
             
              barGap={1}
              barCategoryGap={1}
              maxBarSize={18}
            >
              <CartesianGrid strokeDasharray="1 0" vertical={false} />
              <XAxis
                tickSize={4}
                tickMargin={8}
                interval={0}
                fontSize={9}
                scale={"auto"}
                dataKey="name"
                angle={-30}
                allowDataOverflow={true}
                textAnchor="middle"
                minTickGap={0}
              />
              <YAxis tickSize={4} tickMargin={12} interval={0} fontSize={9} />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                layout="horizontal"
                iconSize={10}
                iconType="circle"
              />
              <Bar
                name={"Leads"}
                dataKey="leadCount"
                fill="#8884d8"
                // barSize={8}
              />
              <Bar
                name={"Contacts"}
                dataKey="contactCount"
                fill="#82ca9d"
                // barSize={8}
              />
              <Bar
                name={"Clients"}
                dataKey="clientCount"
                fill="#d4b171ff"
                // barSize={8}
              />
            </BarChart>
          </ResponsiveContainer>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
