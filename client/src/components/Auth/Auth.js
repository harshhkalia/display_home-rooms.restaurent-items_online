import react, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "",
    property: "",
    loginusername: "",
    loginpassword: "",
  });

  const navigate = useNavigate();

  const handleLoginToogle = () => {
    setIsLogin(!isLogin);
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setData((prevData) => ({ ...prevData, role, property: "" }));
    setIsOwner(role === "owner");
  };

  const handlePropertyChange = (event) => {
    const property = event.target.value;
    setData((prevData) => ({ ...prevData, property }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterEvent = async (e) => {
    e.preventDefault();
    console.log(data);

    if (/\s/.test(data.username)) {
      window.alert("username does not allow any spaces");
      setData({ username: "" });
      return;
    }

    if (data.password !== data.confirmPassword) {
      window.alert("Passwords do not match, re-enter passwords");
      setData({ password: "", confirmPassword: "" });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}createaccount`,
        {
          username: data.username,
          password: data.password,
          fullname: data.fullName,
          role: data.role,
          property: data.property,
        }
      );
      console.log(response);
      window.alert(response.data.message);
      setIsLogin(true);
      if (response.status === 201) {
        setData({
          username: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          role: "",
          property: "",
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to create the account due to : ", error);
        alert("Failed to create the account, please try again!!");
      }
    }
  };

  const handleLoginEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}checkuser`,
        {
          loginusername: data.loginusername,
          loginpassword: data.loginpassword,
        }
      );
      if (response.status === 200) {
        //window.alert(response.data.message);
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "customer") {
          navigate("/selectdetails");
        } else if (user.role === "owner") {
          if (user.property === "Hotel") {
            navigate("/enterhoteldetails");
          } else if (user.property === "Restaurent") {
            const restaurent = JSON.parse(localStorage.getItem("restaurent"));
            if (restaurent) {
              navigate("/restaurentownerdashboard");
            } else {
              navigate("/enterrestaurentdetails");
            }
          }
        } else {
          console.error("Invalid property type");
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to login due to : ", error);
        alert("Failed to login, please try again!!");
      }
    }
  };

  return (
    <>
      <div id="authPageElements">
        <img
          id="authBackgroundImage"
          src="http://localhost:8081/public/images/authpagebackground.jpg"
          alt="Background Image"
        />
        <div id="authElements">
          <div
            id="loginContainer"
            style={{ display: isLogin ? "block" : "none" }}
          >
            <h4 id="loginHeading">LOGIN-FORM</h4>
            <div id="loginCL"></div>
            <form id="loginForm" onSubmit={handleLoginEvent}>
              <input
                type="text"
                id="loginUsername"
                placeholder="Enter username"
                value={data.loginusername}
                onChange={handleInputChange}
                name="loginusername"
                required
              />
              <input
                type="password"
                id="loginPassword"
                placeholder="Enter password"
                value={data.loginpassword}
                onChange={handleInputChange}
                name="loginpassword"
                required
              />
              <button id="loginButton">Login</button>
            </form>
            <a id="goSignup" href="#" onClick={handleLoginToogle}>
              Create account ?
            </a>
          </div>
          <div
            id="signupContainer"
            style={{ display: isLogin ? "none" : "block" }}
          >
            <h4 id="signupHeading">SIGN-UP FORM</h4>
            <div id="signupCL"></div>
            <form id="signupForm" onSubmit={handleRegisterEvent}>
              <input
                type="text"
                id="usernameInput"
                placeholder="Create a username"
                value={data.username}
                onChange={handleInputChange}
                name="username"
                required
              />
              <input
                type="password"
                id="passwordInput"
                placeholder="Enter password"
                value={data.password}
                name="password"
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter password"
                value={data.confirmPassword}
                onChange={handleInputChange}
                name="confirmPassword"
                required
              />
              <input
                type="text"
                id="fullnameInput"
                placeholder="Enter full-name"
                value={data.fullName}
                onChange={handleInputChange}
                name="fullName"
                required
              />
              <select
                id="roleInput"
                onChange={handleRoleChange}
                defaultValue=""
                value={data.role}
                required
              >
                <option value="" disabled>
                  Do you own any home or restaurent ?
                </option>
                <option value="owner">Yes</option>
                <option value="customer">No</option>
              </select>
              <select
                id="ownerInput"
                disabled={!isOwner}
                defaultValue=""
                value={data.property}
                onChange={handlePropertyChange}
              >
                <option value="" disabled>
                  Select what you have
                </option>
                <option value="Hotel">Home</option>
                <option value="Restaurent">Restaurent</option>
              </select>
              <button id="signupButton">Sign-UP</button>
            </form>
            <a id="goLogin" href="#" onClick={handleLoginToogle}>
              Go Back!!
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
