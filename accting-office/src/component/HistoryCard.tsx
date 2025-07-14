import { ActivityItem, Icon, Stack, Text } from "@fluentui/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import type { HistoryInterface } from "../types";



const iconNames: Record<number, string> = {
  0: "question",
  1: "add",
  2: "edit",
  3: "delete",
  4: "link",
  5: "Removelink",
};

const DescriptionColor: Record<number, string> = {
  0: "black",
  1: "green",
  2: "green",
  3: "red",
  4: "rgb(0, 120, 212)",
  5: "rgb(121, 119, 117)",
};

const HistoryCard = () => {
  const [history, setHistory] = useState<HistoryInterface[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const getHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate(`/History/history/${path}`);
      if (response.data) {
        setHistory(response.data);
      }
    } catch (error) {
      // console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {!isLoading &&
        history &&
        history.map((item, key) => {
         
          
          const icon = iconNames[ item.taskPerfoemed as number] || "Note";
          const color = DescriptionColor[ item.taskPerfoemed as number] || "black";

          return (
            <ActivityItem
              key={key}
              activityIcon={<Icon iconName={icon} />}
              activityDescription={` at ${new Date(
                item.createdAt
              ).toLocaleDateString("en", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })} ${new Date(item.createdAt).toLocaleTimeString("en", {
                hour: "2-digit",
                minute: "2-digit",
              })} by ${item.performedBy.name} `}
              onRenderComments={()=>{
                return(
                  <Stack>
                    {item.description.split('/').map((coms,key)=>( 
                      <Text key={key}>
                        {coms}
                      </Text>
                    ))}
                  </Stack>

                )
              }}
              styles={{
                activityTypeIcon: {
                  paddingInlineStart: 15,
                  paddingInlineEnd: 15,
                  fontSize: 20,
                  color,
                },
                activityContent: {
                  paddingBottom: 15,
                  color,
                },
              }}
              style={{ borderBottom: "1px solid rgb(218, 218, 218)" }}
            />
          );
        })}
    </Stack>
  );
};

export default HistoryCard;
