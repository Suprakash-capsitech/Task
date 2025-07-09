import { useFormik } from "formik";
import { object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  DefaultButton,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import Custominput from "./common/Custominput";
import CustomSelect from "./common/CustomSelect";
import type { LeadsInterface } from "../types";
import type { CustomFormprops } from "../types/props";
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
  status: string()
    .oneOf(["active", "inactive"], "Type must be either 'active' or 'inactive'")
    .required("Type is required"),
  phone_number: string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});
interface CustomLeadUpdateFormProps extends CustomFormprops {
  value: LeadsInterface;
}
const LeadUpdateForm = ({
  value,
  OpenForm,
  RefreshList,
  isFormOpen,
}: CustomLeadUpdateFormProps) => {
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: value.name,
      email: value.email,
      type: value.type,
      phone_number: value.phone_Number,
      status: value.status,
    },
    validationSchema: LeadSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.put(
          `/Lead/updatelead/${value.id}`,
          values
        );
        if (response.data) {
          OpenForm(undefined);
          RefreshList();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  const {
    setFieldValue,
    dirty,
    isValid,
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
  } = formik;
  return (
    <Panel
      headerText="Update Lead"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(undefined)}
      type={PanelType.medium}
      isLightDismiss={true}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton
            type="submit"
            form="leadUpdateForm"
            disabled={!dirty || !isValid}
          >
            Save
          </PrimaryButton>
          <DefaultButton onClick={() => OpenForm(false)}>Cancel</DefaultButton>
        </Stack>
      )}
      isFooterAtBottom={true}
    >
      <Stack>
        <form id="leadUpdateForm" onSubmit={handleSubmit}>
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
            <Stack horizontal tokens={{childrenGap:5}} style={{ width: "100%" }}>
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
          </Stack>
          <Stack >
            <CustomSelect
              label="Status"
              selectedKey={values.status}
              onChange={(_, option) => setFieldValue("status", option?.key)}
              onBlur={handleBlur}
              options={[
                {
                  key: "",
                  text: "Please select  status of lead",
                  disabled: true,
                },
                { key: "active", text: "Active" },
                { key: "inactive", text: "In-Active" },
              ]}
              styles={{
                root: { border: "none" },
              }}
            />
            <Text className="error">{touched.status && errors.status}</Text>
          </Stack>
        </form>
      </Stack>
    </Panel>
  );
};

export default LeadUpdateForm;
