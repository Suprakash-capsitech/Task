import { useFormik } from "formik";
import { object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Stack, Text } from "@fluentui/react";
import Custominput from "./common/Custominput";
import Buttoninput from "./common/Buttoninput";
import CustomSelect from "./common/CustomSelect";
import { IoCreate } from "react-icons/io5";
import type { CustomFormprops } from "../types/props";
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

const CreateClientForm = ({ OpenForm, RefreshList }: CustomFormprops) => {
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      type: "",
      status: "",
      address: "",
    },
    validationSchema: ClientSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.post(
          "/Client/createclient",
          values
        );
        if (response.data) {
          OpenForm(false);
          RefreshList();
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <Stack>
      <form className="d-flex flex-column gap-3" onSubmit={formik.handleSubmit}>
        <CustomSelect
          label="Type"
          selectedKey={formik.values.type}
          onChange={(_, option) => formik.setFieldValue("type", option?.key)}
          onBlur={formik.handleBlur}
          options={[
            { key: "", text: "Please select  type of client", disabled: true },
            { key: "limited", text: "Limited" },
            { key: "individual", text: "Individual" },
            { key: "Partnersihp", text: "Partnersihp" },
            { key: "LLP", text: "LLP" },
          ]}
          styles={{
            root: { border: "none" },
          }}
        />
        <Text className="error">
          {formik.touched.type && formik.errors.type}
        </Text>
        <Custominput
          name="Business Name"
          type="text"
          classname=" border-0"
          placeholder="Full Name"
          value={formik.values.name}
          onChange={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
        />
        <Text className="error">
          {formik.touched.name && formik.errors.name}
        </Text>
        <Custominput
          name="email"
          type="email"
          classname=" border-0"
          placeholder="Email@Address"
          value={formik.values.email}
          onChange={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
        />
        <Text className="error">
          {formik.touched.email && formik.errors.email}
        </Text>
        <Custominput
          name="address"
          type="text"
          classname=" border-0"
          placeholder="Address"
          value={formik.values.address}
          onChange={formik.handleChange("address")}
          onBlur={formik.handleBlur("address")}
        />
        <Text className="error">
          {formik.touched.address && formik.errors.address}
        </Text>

        <CustomSelect
          label="Status"
          selectedKey={formik.values.status}
          onChange={(_, option) => formik.setFieldValue("status", option?.key)}
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
        <Text className="error">
          {formik.touched.status && formik.errors.status}
        </Text>
        <Buttoninput
          color="primary"
          icon={<IoCreate />}
          label="Save"
          type="submit"
        />
      </form>
    </Stack>
  );
};

export default CreateClientForm;
