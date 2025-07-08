import {
  Persona,
  PersonaPresence,
  PersonaSize,
  Pivot,
  PivotItem,
  Spinner,
  Stack,
} from "@fluentui/react";
import CustomBreadCrum from "../component/common/CustomBreadCrum";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import type { ClientInterface, HistoryInterface } from "../types";
import HistoryCard from "../component/HistoryCard";
import ProfileCard from "../component/ProfileCard";
const SingleClient = () => {
  const [client, setclient] = useState<ClientInterface>();

  const [isloading, setisloading] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<string>("profile");
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const axiosPrivate = useAxiosPrivate();
  const [history, sethistory] = useState<HistoryInterface[]>();
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
  const BreadCrumitem = [
    { key: "home", text: "Home", href: "/" },
    { key: "client", text: "Client", href: "/client" },
    { key: "SingleClient", text: client?.name || "", href: location.pathname },
  ];

  const GetClientDetails = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate.get(`Client/client/${path}`);

      if (response.data) {
        setclient(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    GetClientDetails();
    GetHistory();
  }, []);
  const handleTabClick = (item?: PivotItem) => {
    const key = item?.props.itemKey;
    if (key) {
      setSearchParam(key);
    }
  };
  return (
    <Stack>
      <CustomBreadCrum items={BreadCrumitem} />
      {isloading ? (
        <Spinner label="Data is Loading" />
      ) : (
        <Stack tokens={{ padding: 15, childrenGap: 10 }}>
          <Persona
            imageUrl={"image.png"}
            imageInitials={client?.name.slice(0, 2)}
            text={client?.name}
            secondaryText={client?.type}
            showSecondaryText
            size={PersonaSize.size72}
            presence={
              client?.status == "active"
                ? PersonaPresence.online
                : PersonaPresence.offline
            }
            imageAlt="profile"
          />
          <Pivot onLinkClick={handleTabClick} selectedKey={searchParam}>
            <PivotItem
              headerText="Profile"
              itemIcon="Contact"
              itemKey="profile"
            >
              {client && <ProfileCard data={client} />}
            </PivotItem>
            <PivotItem
              headerText="History"
              itemIcon="history"
              itemKey="history"
            >
              {history && <HistoryCard data={history} />}
            </PivotItem>
          </Pivot>
        </Stack>
      )}
    </Stack>
  );
};

export default SingleClient;
