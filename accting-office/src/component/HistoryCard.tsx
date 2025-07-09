import type { HistoryInterface } from "../types";
import { ActivityItem, Icon, Stack } from "@fluentui/react";
import type { FC } from "react";

interface HistoryCardProps {
  data: HistoryInterface[];
}
const iconNames: Record<"Created" | "Updated" | "Deleted" | "Linked"|"Unlinked", string> = {
  Created: "add",
  Updated: "edit",
  Deleted: "delete",
  Linked: "link",
  Unlinked: "Removelink",
};
const HistoryCard: FC<HistoryCardProps> = ({ data }) => {
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {data.map((Item, key) => {
        const icon =
          iconNames[Item.task_Performed as keyof typeof iconNames] || "Note";

        return (
          <ActivityItem
            activityIcon={<Icon iconName={icon} />}
            activityDescription={Item.description}
            comments={`performed by ${Item.performed_By.name}`}
            key={key}
            style={{ borderBottom: "1px solid rgb(218, 218, 218)" }}
          />
        );
      })}
    </Stack>
  );
};

export default HistoryCard;
