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
import type { HistoryInterface, LeadsInterface } from "../types";
import ProfileCard from "../component/ProfileCard";
import HistoryCard from "../component/HistoryCard";
import LeadUpdateForm from "../component/LeadUpdateForm";
const SingleLead = () => {
  const [lead, setlead] = useState<LeadsInterface>();
  const [isloading, setisloading] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<string>("profile");
  const location = useLocation();
  const [openForm, setopenForm] = useState<boolean>(false);
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
    { key: "lead", text: "Lead", href: "/lead" },
    { key: "Singlelead", text: lead?.name || "", href: location.pathname },
  ];
  const RefreshDetails = () => {
    GetLeadDetails();
    GetHistory()
  }
  const GetLeadDetails = async () => {
    setisloading(true);
    try {
      const response = await axiosPrivate.get(`Lead/lead/${path}`);

      if (response.data) {
        setlead(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    GetLeadDetails();
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
            imageInitials={lead?.name.slice(0, 2)}
            text={lead?.name}
            secondaryText={lead?.type}
            showSecondaryText
            size={PersonaSize.size72}
            presence={
              lead?.status == "active"
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
              {lead && <ProfileCard OpenForm={setopenForm} data={lead} />}
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
    {openForm && lead && <LeadUpdateForm OpenForm={setopenForm}  isFormOpen={openForm} value={lead} RefreshList={RefreshDetails}/>}
    </Stack>
  );
};

export default SingleLead;
