import { Link, useNavigate } from "react-router-dom";
import Buttoninput from "../component/common/Buttoninput";
import { FaSignInAlt } from "react-icons/fa";
import Custominput from "../component/common/Custominput";
import { isAxiosError } from "axios";
import { axiosPrivate } from "../config/axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { object, string } from "yup";
import CustomSelect from "../component/common/CustomSelect";
import { Stack, Text } from "@fluentui/react";

const Signupschemavalidator = object({
  name: string().required("Please Enter Name"),
  password: string().required("password is required"),
  role: string().required("Role is required"),
  email: string()
    .matches(
      new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"),
      "Invalid email format"
    )
    .required("Email is required"),
});
const Signup = () => {
  const [errormessage, seterrormessage] = useState<string>("");
  const Navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      Navigate("/");
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Signupschemavalidator,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.post("/User/signup", values);
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.name);

          localStorage.setItem("role", response.data.role);
          Navigate("/", { replace: true });
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (!error.response) {
            console.log("Server not responding");
          } else {
            seterrormessage(error?.response.data);
          }
        } else {
          console.log("An unexpected error occurred");
        }
      }
    },
  });
  const { handleBlur, handleChange, handleSubmit, touched, errors, values } =
    formik;
  return (
    <Stack
      styles={{
        root: {
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        },
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "20%",
          padding: 15,
          borderRadius: 12,
          borderTop: "5px solid  rgb(0, 120, 212)",
          boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
        }}
      >
        <Stack
          styles={{
            root: {
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <img src="./image.png" alt="icon" />
          <h4 className="text-center">Create Your Account</h4>

          <Text className="error">{errormessage}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 8 }}>
          <Custominput
            name="name"
            type="text"
            placeholder="Name"
            classname="border-0"
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
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Text className="error">{touched.email && errors.email}</Text>
          <Custominput
            name="password"
            type="password"
            classname=" border-0"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Text className="error">{touched.password && errors.password}</Text>
          <CustomSelect
            label="Role"
            selectedKey={formik.values.role}
            onChange={(_, option) => formik.setFieldValue("role", option?.key)}
            onBlur={formik.handleBlur}
            options={[
              { key: "", text: "Please select a role", disabled: true },
              { key: "admin", text: "Admin" },
              { key: "user", text: "User" },
            ]}
            styles={{
              root: { border: "none" },
            }}
          />
          <Text className="error">
            {formik.touched.role && formik.errors.role}
          </Text>
          <Buttoninput
            color="success"
            icon={<FaSignInAlt />}
            label="Signup"
            type="submit"
          />
        </Stack>

        <Text className="text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-success text-decoration-none ">
            Sign in here
          </Link>
        </Text>
      </form>
    </Stack>
  );
};

export default Signup;
