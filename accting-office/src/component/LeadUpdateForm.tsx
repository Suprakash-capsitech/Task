import { useFormik } from "formik";
import { object, string } from "yup";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Stack } from "@fluentui/react";
import Custominput from "./common/Custominput";
import Buttoninput from "./common/Buttoninput";
import CustomSelect from "./common/CustomSelect";
import { IoCreate } from "react-icons/io5";
import type { LeadsInterface } from "../types";
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
interface CustomFormProps {
  value: LeadsInterface;
  OpenForm: (isOpen: any) => void;
  RefreshList: () => void;
}
const LeadUpdateForm = ({ value, OpenForm, RefreshList }: CustomFormProps) => {
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
  return (
    <Stack>
      <form className="d-flex flex-column gap-3" onSubmit={formik.handleSubmit}>
        <Custominput
          name="name"
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
          name="phone_number"
          type="text"
          classname=" border-0"
          placeholder="Phone Number"
          value={formik.values.phone_number}
          onChange={formik.handleChange("phone_number")}
          onBlur={formik.handleBlur("phone_number")}
        />
        <div className="error">
          {formik.touched.phone_number && formik.errors.phone_number}
        </div>
        <CustomSelect
          label="Type"
          selectedKey={formik.values.type}
          onChange={(_, option) => formik.setFieldValue("type", option?.key)}
          onBlur={formik.handleBlur}
          options={[
            { key: "", text: "Please select a role", disabled: true },
            { key: "lead", text: "Lead" },
            { key: "contact", text: "Contact" },
          ]}
          styles={{
            root: { border: "none" },
          }}
        />
        <div className="error">{formik.touched.type && formik.errors.type}</div>{" "}
        <CustomSelect
          label="Status"
          selectedKey={formik.values.status}
          onChange={(_, option) => formik.setFieldValue("status", option?.key)}
          onBlur={formik.handleBlur}
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

export default LeadUpdateForm;
