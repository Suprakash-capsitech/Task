import { MdLogin } from "react-icons/md";
import Custominput from "../component/common/Custominput";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { axiosPrivate } from "../config/axios";
import { object, string } from "yup";
import Buttoninput from "../component/common/Buttoninput";
import { Stack, Text } from "@fluentui/react";

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
          minHeight:"100vh"
        },
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "20%",
          padding: 15,
          borderRadius:12,
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
          <h4 className="text-center">Welcome Back</h4>
          <Text className="error">{errormessage}</Text>
        </Stack>
        <Stack tokens={{ childrenGap: 8 }}>
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
          <Buttoninput
            color="primary"
            icon={<MdLogin />}
            type="submit"
            label="Login"
          />
        </Stack>
        <Text className="text-center">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-primary text-decoration-none ">
            Sign up here
          </Link>
        </Text>
      </form>
    </Stack>
  );
};

export default Login;
