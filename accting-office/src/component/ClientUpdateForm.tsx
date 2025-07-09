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
import type { CustomFormprops } from "../types/props";
import type { ClientInterface } from "../types";
const ClientSchema = object({
  name: string().required("Name is required"),
  address: string().required("Address is required"),
  email: string()
    .matches(
      new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$"),
      "Invalid email format"
    )
    .required("Email is required"),
  type: string()
    .oneOf(
      ["limited", "individual", "LLP", "Partnersihp"],
      `Type must be "limited", "individual", "LLP", "Partnersihp"`
    )
    .required("Type is required"),
  status: string()
    .oneOf(
      ["active", "inactive"],
      "Status must be either 'active' or 'inactive'"
    )
    .required("Status is required"),
});
interface clientUpdateform extends CustomFormprops {
  value: ClientInterface;
}
const ClientUpdateForm = ({
  value,
  isFormOpen,
  OpenForm,
  RefreshList,
}: clientUpdateform) => {
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: value.name,
      email: value.email,
      type: value.type,
      status: value.status,
      address: value.address,
    },
    validationSchema: ClientSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.put(
          `/Client/updateclient/${value.id}`,
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
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    dirty,
    setFieldValue,
    isValid,
  } = formik;
  return (
    <Panel
      headerText="Update Client"
      isOpen={isFormOpen}
      onDismiss={() => OpenForm(undefined)}
      type={PanelType.medium}
      isLightDismiss={true}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <Stack horizontal tokens={{ childrenGap: 12 }}>
          <PrimaryButton
            type="submit"
            form="ClientUpdateForm"
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
        <form id="ClientUpdateForm" onSubmit={handleSubmit}>
          <Stack horizontal tokens={{childrenGap:5}} style={{ width: "100%" }}>
            <Stack style={{ width: "30%" }}>
              <CustomSelect
                label="Type"
                selectedKey={values.type}
                onChange={(_, option) => setFieldValue("type", option?.key)}
                onBlur={handleBlur}
                options={[
                  {
                    key: "",
                    text: "Select  type of client",
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
              <Text className="error">{touched.type && errors.type}</Text>
            </Stack>
            <Stack style={{ width: "70%" }}>
              <Custominput
                name="name"
                type="text"
                classname=" border-0"
                placeholder="Business Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Text className="error">{touched.name && errors.name}</Text>
            </Stack>
          </Stack>
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
          <Custominput
            name="address"
            type="text"
            classname=" border-0"
            placeholder="Address"
            value={values.address}
            onChange={handleChange("address")}
            onBlur={handleBlur("address")}
          />
          <Text className="error">{touched.address && errors.address}</Text>
          <CustomSelect
            label="Status"
            selectedKey={formik.values.status}
            onChange={(_, option) =>
              formik.setFieldValue("status", option?.key)
            }
            onBlur={formik.handleBlur}
            options={[
              {
                key: "",
                text: "Please select  status of client",
                disabled: true,
              },
              { key: "active", text: "Active" },
              { key: "inactive", text: "In-Active" },
            ]}
            styles={{
              root: { border: "none" },
            }}
          />
          <div className="error">
            {formik.touched.status && formik.errors.status}
          </div>
        </form>
      </Stack>
    </Panel>
  );
};
export default ClientUpdateForm;
