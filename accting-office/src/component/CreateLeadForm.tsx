import { useFormik } from "formik";
import { object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  ActionButton,
  DefaultButton,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import Custominput from "./common/Custominput";
import CustomSelect from "./common/CustomSelect";
import type { CustomFormprops } from "../types/props";
import Select from "react-select";
import { useEffect, useState } from "react";
import type { ClientInterface } from "../types";
const LeadSchema = object({
  name: string().required("Name is required"),
  email: string()
    .matches(
      new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$"),
      "Invalid email format"
    )
    .required("Email is required"),
  type: string()
    .oneOf(["lead", "contact"], "Type must be either 'lead' or 'contact'")
    .required("Type is required"),
  phone_number: string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  client_id: string().optional(),
});
const CreateLeadForm = ({
  OpenForm,
  RefreshList,
  isFormOpen,
}: CustomFormprops) => {
  const [client, setClient] = useState<ClientInterface[]>([]);
  const [clientlist, setclientlist] = useState<
    { value: string; label: string }[]
  >([]);
  const [linkClient, setlinkClient] = useState<boolean>(false);
  const [clientType, setclientType] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      type: "",
      phone_number: "",
      client_id: "",
    },
    validationSchema: LeadSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.post("/Lead/createlead", values);
        if (response.data) {
          OpenForm(false);
          RefreshList();
          resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const {
    setFieldValue,
    resetForm,
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
  } = formik;

  const GetClients = async () => {
    try {
      const response = await axiosPrivate("/Client/clients");
      if (response.data) {
        setClient(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetClients();
  }, []);
  useEffect(() => {
    setclientlist(
      client
        ?.filter((item) => item.type === clientType)
        .map((item) => ({
          value: item.id,
          label: item.name,
        }))
    );
  }, [clientType]);
  return (
    <Panel
      headerText="Add Lead"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(false)}
      type={PanelType.medium}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton
            iconProps={{ iconName: "Save" }}
            type="submit"
            form="leadForm"
          >
            Save
          </PrimaryButton>
          <DefaultButton
            iconProps={{ iconName: "cancel" }}
            onClick={() => OpenForm(false)}
          >
            Cancel
          </DefaultButton>
        </Stack>
      )}
      isFooterAtBottom={true}
    >
      <Stack>
        <form id="leadForm" onSubmit={handleSubmit}>
          <Stack tokens={{ childrenGap: 10 }} style={{ width: "100%" }}>
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              style={{ width: "100%" }}
            >
              <Stack style={{ width: "50%" }}>
                <Custominput
                  name="name"
                  type="text"
                  classname=" border-0"
                  placeholder="Full Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Text className="error">{touched.name && errors.name}</Text>
              </Stack>
              <Stack style={{ width: "50%" }}>
                <Custominput
                  name="email"
                  type="email"
                  classname=" border-0"
                  placeholder="Email@Address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Text className="error">{touched.email && errors.email}</Text>
              </Stack>
            </Stack>
            <Stack
              horizontal
              tokens={{ childrenGap: 5 }}
              style={{ width: "100%" }}
            >
              <Stack style={{ width: "50%" }}>
                <Custominput
                  name="phone_number"
                  type="text"
                  classname=" border-0"
                  placeholder="Phone Number"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Text className="error">
                  {touched.phone_number && errors.phone_number}
                </Text>
              </Stack>
              <Stack style={{ width: "50%" }}>
                <CustomSelect
                  label="Type"
                  selectedKey={values.type}
                  onChange={(_, option) =>
                    formik.setFieldValue("type", option?.key)
                  }
                  onBlur={handleBlur}
                  options={[
                    { key: "", text: "Please select a role", disabled: true },
                    { key: "lead", text: "Lead" },
                    { key: "contact", text: "Contact" },
                  ]}
                  styles={{
                    root: { border: "none" },
                  }}
                />
                <Text className="error">{touched.type && errors.type}</Text>
              </Stack>
            </Stack>
            <Stack horizontalAlign="start">
              <ActionButton
                iconProps={{ iconName: `${linkClient ? "remove" : "Link"}` }}
                onClick={() => setlinkClient((prev) => !prev)}
                styles={{
                  root: {
                    backgroundColor: "rgb(248, 248, 248)",
                    borderRadius: 8,
                    fontSize: 12,
                  },
                  icon: {
                    color: "rgb(51, 51, 51)",
                  },
                }}
              >
                Client
              </ActionButton>
            </Stack>
            {linkClient && (
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <Stack style={{ width: "30%" }}>
                  <CustomSelect
                    label="Type"
                    selectedKey={clientType}
                    onChange={(_, option) =>
                      setclientType(option?.key as string)
                    }
                    onBlur={handleBlur}
                    options={[
                      {
                        key: "",
                        text: "Select Type",
                        disabled: true,
                      },
                      { key: "limited", text: "Limited" },
                      { key: "individual", text: "Individual" },
                      { key: "Partnersihp", text: "Partnersihp" },
                      { key: "LLP", text: "LLP" },
                    ]}
                    styles={{
                      root: { border: "none" },
                    }}
                  />
                </Stack>
                <Stack style={{ width: "70%" }}>
                  <Label>Business Name </Label>
                  <Select
                    options={clientlist}
                    onChange={(item) => setFieldValue("client_id", item?.value)}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </form>
      </Stack>
    </Panel>
  );
};

export default CreateLeadForm;
