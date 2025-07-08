import type { FC } from "react";
import type { ClientInterface, LeadsInterface } from "../types";
import { Label, Stack, Text } from "@fluentui/react";

interface proilfeprops {
  data: LeadsInterface | ClientInterface;
}
const ProfileCard: FC<proilfeprops> = ({ data }) => {
  return (
    <Stack
      tokens={{ padding: 5 }}
      style={{
        backgroundColor: "rgb(248, 248, 248)",
        border: "1px solid rgb(218, 218, 218)",
        borderRadius: 5,
      }}
    >
      <Text style={{ borderBottom: "1px solid rgb(218, 218, 218)" }}>
        Basic Details
      </Text>
      <Stack>
        <Stack
          horizontal
          tokens={{ padding: 15 }}
        >
          <Stack horizontal horizontalAlign="start" style={{width:"30%"}}>
            <Text>
              <Label>Name: </Label>
              {data.name}
            </Text>
          </Stack>
          <Stack horizontal horizontalAlign="start" style={{width:"30%"}}>
            <Text>
              <Label>Email: </Label> {data.email}
            </Text>
          </Stack>
          <Stack horizontal horizontalAlign="start"style={{width:"30%"}}>
            <Text>
              <Label>Type: </Label> {data.type}
            </Text>
          </Stack>
        </Stack>
        <Stack
          horizontal
          // verticalAlign="start"
          tokens={{ padding: 15 }}
        >
          <Stack horizontal horizontalAlign="start" style={{width:"30%"}}>
            <Text>
              <Label>Created At: </Label>
              {new Date(data.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Stack>
          {"address" in data && (
            <Stack horizontal horizontalAlign="start" style={{width:"30%"}}>
              <Text>
                <Label>Address:</Label> {data.address}
              </Text>
            </Stack>
          )}
          {"status" in data && (
            <Stack horizontal horizontalAlign="start" style={{width:"30%"}}>
              <Text>
                <Label>Status: </Label> {data.status}
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ProfileCard;
