import { MdLogin } from "react-icons/md";
import Custominput from "../component/common/Custominput";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { axiosPrivate } from "../config/axios";
import { object, string } from "yup";
import Buttoninput from "../component/common/Buttoninput";
import { Text } from "@fluentui/react";

const Loginschemavalidator = object({
  password: string().required("password is required").min(6),
  email: string()
    .matches(
      new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)+$"),
      "Invalid email format"
    )
    .required("Email is required"),
});
const Login = () => {
  const Navigate = useNavigate();
  const [errormessage, seterrormessage] = useState<string>("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      Navigate("/");
    }
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Loginschemavalidator,
    onSubmit: async (values) => {
      try {
        const response = await axiosPrivate.post("/User/login", values);
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("role", response.data.role);
          // toast.success(response.data.name);
          Navigate("/", {
            replace: true,
          });
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          if (!error.response) {
            console.log("Server not responding");
          } else {
            seterrormessage(error?.response.data);
            // console.log(error.response.data);
          }
        } else {
          console.log("An unexpected error occurred");
        }
      }
    },
  });
  return (
    <div className="  d-flex  align-items-center justify-content-center ">
      <form
        onSubmit={formik.handleSubmit}
        className="  d-flex flex-column  gap-2 p-3 rounded shadow loginform bg-white"
      >
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img src="./image.png" alt="icon" />
          <h4 className="text-center">Welcome Back</h4>
          <Text className="error">{errormessage}</Text>
        </div>

        <Custominput
          name="Email"
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
          name="password"
          type="password"
          classname=" border-0"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
        />

        <Text className="error">
          {formik.touched.password && formik.errors.password}
        </Text>
        <Buttoninput
          color="primary"
          icon={<MdLogin />}
          type="submit"
          label="Login"
        />
        <Text className="text-center">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-primary text-decoration-none ">
            Sign up here
          </Link>
        </Text>
      </form>
    </div>
  );
};

export default Login;
