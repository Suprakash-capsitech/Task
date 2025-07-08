import { useFormik } from "formik";
import { object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Stack } from "@fluentui/react";
import Custominput from "./common/Custominput";
import Buttoninput from "./common/Buttoninput";
import CustomSelect from "./common/CustomSelect";
import { IoCreate } from "react-icons/io5";
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
        <div className="error">{formik.touched.type && formik.errors.type}</div>
        <Custominput
          name="Business Name"
          type="text"
          classname=" border-0"
          placeholder="Full Name"
          value={formik.values.name}
          onChange={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
        />
        <div className="error">{formik.touched.name && formik.errors.name}</div>
        <Custominput
          name="email"
          type="email"
          classname=" border-0"
          placeholder="Email@Address"
          value={formik.values.email}
          onChange={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
        />
        <div className="error">
          {formik.touched.email && formik.errors.email}
        </div>
        <Custominput
          name="address"
          type="text"
          classname=" border-0"
          placeholder="Address"
          value={formik.values.address}
          onChange={formik.handleChange("address")}
          onBlur={formik.handleBlur("address")}
        />
        <div className="error">
          {formik.touched.address && formik.errors.address}
        </div>

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
        <div className="error">
          {formik.touched.status && formik.errors.status}
        </div>
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
export default ClientUpdateForm;
