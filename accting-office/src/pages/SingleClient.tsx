import {
  ActionButton,
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
import type { ClientInterface } from "../types";
import HistoryCard from "../component/HistoryCard";
import ProfileCard from "../component/ProfileCard";
import ContactPivot from "../component/ContactPivot";
import ClientUpdateForm from "../component/ClientUpdateForm";
import { ClientTypeCnversion } from "../utils/EnumtoString";
const SingleClient = () => {
  const [client, setclient] = useState<ClientInterface>();
  const [isloading, setisloading] = useState<boolean>(false);
  const [openForm, setopenForm] = useState<boolean>(false);

  const [searchParam, setSearchParam] = useState<string>("profile");
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const axiosPrivate = useAxiosPrivate();

  const BreadCrumitem = [
    { key: "home", text: "Home", href: "/" },
    { key: "client", text: "Client", href: "/client" },
    { key: "SingleClient", text: client?.name || "", href: location.pathname },
  ];
  const ActionButtonlist = [
    { title: "Add Note", iconName: "CommentAdd" },
    { title: "Send Email", iconName: "NewMail" },
    { title: "Create New Invoice", iconName: "AccountActivity" },
    { title: "Create New Quote", iconName: "Money" },
    { title: "Create New E-signature", iconName: "AddToShoppingList" },
    { title: "Create New Data Request", iconName: "DietPlanNotebook" },
    { title: "Create or View access codes", iconName: "QRCode" },
    { title: "Click to add a complaint", iconName: "ReportLibraryMirrored" },
    { title: "Set Private", iconName: "Unlock" },
    { title: "Client User", iconName: "Contact" },
    { title: "Add new Tag", iconName: "Tag" },
  ];
  const refreshDetails = () => {
    GetClientDetails();
  };
  const GetClientDetails = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate.get(`Client/client/${path}`);

      if (response.data) {
        setclient(response.data);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setisloading(false);
    }
  };

  useEffect(() => {
    GetClientDetails();
  }, []);
  const handleTabClick = (item?: PivotItem) => {
    const key = item?.props.itemKey;
    if (key) {
      setSearchParam(key);
    }
  };
  return (
    <Stack tokens={{ maxHeight: "90vh" }}>
      <CustomBreadCrum items={BreadCrumitem} />
      {isloading ? (
        <Spinner label="Data is Loading" />
      ) : (
        <Stack
          tokens={{ childrenGap: 10 }}
          style={{ minHeight: "100%", overflow: "auto" }}
        >
          <Stack tokens={{ padding: 10 }}>
            <Persona
              imageUrl={"image.png"}
              imageInitials={client?.name.slice(0, 2)}
              text={client?.name}
              secondaryText={ClientTypeCnversion[client?.type as number]}
              showSecondaryText
              onRenderTertiaryText={() => (
                <Stack horizontal tokens={{ childrenGap: 8 }}>
                  {ActionButtonlist.map((item) => (
                    <ActionButton
                      key={item.title}
                      title={item.title}
                      iconProps={{ iconName: item.iconName }}
                    />
                  ))}
                </Stack>
              )}
              styles={{
                secondaryText: {
                  padding: 5,
                },
                primaryText: {
                  paddingInlineStart: 5,
                },
              }}
              size={PersonaSize.size72}
              presence={
                client?.status == 1
                  ? PersonaPresence.online
                  : PersonaPresence.offline
              }
              imageAlt="profile"
            />
          </Stack>
          <Stack
            style={{
              minHeight: "100%",
              overflow: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <Pivot
              onLinkClick={handleTabClick}
              selectedKey={searchParam}
              styles={{
                link: { padding: 20 },
                itemContainer: {
                  paddingTop: 15,
                },
              }}
            >
              <PivotItem
                headerText="Profile"
                itemIcon="Contact"
                itemKey="profile"
              >
                {client && <ProfileCard OpenForm={setopenForm} data={client} />}
              </PivotItem>
              <PivotItem
                headerText="History"
                itemIcon="history"
                itemKey="history"
              >
                {history && <HistoryCard />}
              </PivotItem>
              <PivotItem
                headerText="Contact"
                itemIcon="Phone"
                itemKey="Contact"
              >
                {client && <ContactPivot />}
              </PivotItem>
            </Pivot>
          </Stack>
        </Stack>
      )}
      {openForm && client && (
        <ClientUpdateForm
          OpenForm={setopenForm}
          isFormOpen={openForm}
          value={client}
          RefreshList={refreshDetails}
        />
      )}
    </Stack>
  );
};

export default SingleClient;
