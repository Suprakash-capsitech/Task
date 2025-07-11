import type { HistoryInterface } from "../types";
import { ActivityItem, Icon, Stack } from "@fluentui/react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation } from "react-router-dom";

const iconNames: Record<
  "Created" | "Updated" | "Deleted" | "Linked" | "Unlinked",
  string
> = {
  Created: "add",
  Updated: "edit",
  Deleted: "delete",
  Linked: "link",
  Unlinked: "Removelink",
};
const DescriptionColor: Record<
  "Created" | "Updated" | "Deleted" | "Linked" | "Unlinked",
  string
> = {
  Created: "green",
  Updated: "green",
  Deleted: "red",
  Linked: "rgb(0, 120, 212)",
  Unlinked: "rgb(121, 119, 117)",
};
const HistoryCard = () => {
  const [history, sethistory] = useState<HistoryInterface[]>();

  const [isloading, setisloading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const GetHistory = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate(`/History/history/${path}`);

      if (response.data) {
        sethistory(response.data);
        setisloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    GetHistory();
  }, []);
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {!isloading &&
        history &&
        history.map((Item, key) => {
          const icon =
            iconNames[Item.task_Performed as keyof typeof iconNames] || "Note";
          const color =
            DescriptionColor[Item.task_Performed as keyof typeof iconNames] ||
            "black";

          return (
            <ActivityItem
              activityIcon={<Icon iconName={icon} />}
              activityDescription={`${Item.description} at ${new Date(
                Item.createdAt
              ).toLocaleDateString("en", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })} ${new Date(Item.createdAt).toLocaleDateString("en", {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
              comments={`performed by ${Item.performed_By.name}`}
              key={key}
              styles={{
                activityTypeIcon: {
                  paddingInlineStart: 15,
                  paddingInlineEnd: 15,
                  alignContent: "center",
                  fontSize: 20,

                  color: color,
                },
                activityContent: {
                  paddingBottom: 15,
                  color: color,
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
