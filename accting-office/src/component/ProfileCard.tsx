import type { FC } from "react";
import type { ClientInterface, LeadsInterface } from "../types";
import { ActionButton,  Label, Stack, Text } from "@fluentui/react";
import { useLocation } from "react-router-dom";
import { ClientTypeCnversion, LeadTypeCnversion, StatusConversion } from "../utils/EnumtoString";

interface proilfeprops {
  data: LeadsInterface | ClientInterface;
  OpenForm: (isOpen: boolean)=> void
}
const ProfileCard: FC<proilfeprops> = ({ data , OpenForm }) => {
  const location = useLocation()
  const path = location.pathname.split("/")[1];

  return (
    <Stack tokens={{childrenGap:10 , padding:10}}>
      <Stack
        tokens={{ padding: 5 }}
        style={{
          backgroundColor: "rgb(248, 248, 248)",
          border: "1px solid rgb(218, 218, 218)",
          borderRadius: 5,
        }}
      >
        <Stack horizontal horizontalAlign="space-between" style={{ borderBottom: "1px solid rgb(218, 218, 218)", paddingInline: 10 }} verticalAlign="center">

        <Text >
          Basic Details
        </Text>
        <ActionButton
        onClick={()=> OpenForm(true)}
        title="edit" iconProps={{iconName :"edit"}}></ActionButton>
        </Stack>
        <Stack>
          <Stack horizontal tokens={{ padding: 15 }}>
            <Stack horizontal horizontalAlign="start" style={{ width: "30%" }}>
              <Text>
                <Label>Name: </Label>
                {data.name}
              </Text>
            </Stack>
            <Stack horizontal horizontalAlign="start" style={{ width: "30%" }}>
              <Text>
                <Label>Email: </Label> {data.email}
              </Text>
            </Stack>
            <Stack horizontal horizontalAlign="start" style={{ width: "30%" }}>
              <Text>
                <Label>Type: </Label> {path=="lead" ? LeadTypeCnversion[data.type]: ClientTypeCnversion[data.type]}
              </Text>
            </Stack>
          </Stack>
          <Stack
            horizontal
            tokens={{ padding: 15 }}
          >
            <Stack horizontal horizontalAlign="start" style={{ width: "30%" }}>
              <Text>
                <Label>Created At: </Label>
                {new Date(data.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Stack>

            {"status" in data && (
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>Status: </Label> {StatusConversion[data.status]}
                </Text>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
      {"address" in data && (
        <Stack
          tokens={{ padding: 5 }}
          style={{
            backgroundColor: "rgb(248, 248, 248)",
            border: "1px solid rgb(218, 218, 218)",
            borderRadius: 5,
          }}
        >
          <Text style={{ borderBottom: "1px solid rgb(218, 218, 218)" }}>
            Address Details
          </Text>
          <Stack>
            <Stack horizontal tokens={{ padding: 15 }}>
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>Street: </Label>
                  {data.address.street}
                </Text>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>Area: </Label> {data.address.area}
                </Text>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>City: </Label> {data.address.city}
                </Text>
              </Stack>
            </Stack>
            <Stack
              horizontal
              // verticalAlign="start"
              tokens={{ padding: 15 }}
            >
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>County: </Label> {data.address.county}
                </Text>
              </Stack>
              <Stack
                horizontal
                horizontalAlign="start"
                style={{ width: "30%" }}
              >
                <Text>
                  <Label>Country: </Label> {data.address.country}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default ProfileCard;