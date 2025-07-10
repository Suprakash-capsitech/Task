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
import { Text } from "@fluentui/react";

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
          // toast.success(response.data.name);
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
  return (
    <div className="d-flex  justify-content-center align-items-center py-3">
      <form
        onSubmit={formik.handleSubmit}
        className="d-flex flex-column  gap-2 p-4  shadow rounded-3 loginform bg-white "
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img src="./image.png" alt="icon" />
          <h4 className="text-center">Create Your Account</h4>

          <Text className="error">{errormessage}</Text>
        </div>
        <Custominput
          name="name"
          type="text"
          placeholder="Name"
          classname="border-0"
          value={formik.values.name}
          onChange={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
        />
        <div className="error">{formik.touched.name && formik.errors.name}</div>

        <Custominput
          name="Email"
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
          name="password"
          type={"password"}
          classname=" border-0"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
        />
        <div className="error">
          {formik.touched.password && formik.errors.password}
        </div>
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
        <div className="error">{formik.touched.role && formik.errors.role}</div>
        <Buttoninput
          color="success"
          icon={<FaSignInAlt />}
          label="Signup"
          type="submit"
        />

        <div className="text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-success text-decoration-none ">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
