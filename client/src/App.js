import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import LoginsuccessfullPageCustomer from "./components/loginsuccessfullpage/LoginsuccessfullCustomer";
import LoginsuccessfullPageOwner from "./components/loginsuccessfullpage/LoginsuccessfullOwner";
import LoginsuccessfullRowner from "./components/loginsuccessfullpage/LoginsuccessfullOwnerR";
import RestaurentOwnerHomePage from "./components/home/HomeRestaurentOwner";
import ProtectedRoute from "./components/route/ProtectedRoute";
import ResOwnItemPage from "./components/home/HomeResOwnItems";
import ViewRestaurents from "./components/loginsuccessfullpage/CustomerViewRestaurents";
import ViewVillas from "./components/loginsuccessfullpage/CustomerViewVillas";
import PurchaseResItems from "./components/home/CustomerPurchaseResItems";
import CustomerRestaurentSettings from "./components/home/CustomerRestaurentSettings";
import OwnerHomePage from "./components/home/OwnerOfHomeHome";
import CusHomePageForHomes from "./components/home/CusHomePageForHomes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute fallback={Auth} />}></Route>
          <Route
            path="/selectdetails"
            element={<LoginsuccessfullPageCustomer />}
          ></Route>
          <Route
            path="/enterhoteldetails"
            element={<LoginsuccessfullPageOwner />}
          ></Route>
          <Route
            path="/enterrestaurentdetails"
            element={<LoginsuccessfullRowner />}
          ></Route>
          <Route
            path="/restaurentownerdashboard"
            element={<ResOwnItemPage />}
          ></Route>
          <Route
            path="/restaurentownersettingspage"
            element={<RestaurentOwnerHomePage />}
          ></Route>
          <Route
            path="/viewallrestaurents"
            element={<ViewRestaurents />}
          ></Route>
          <Route path="/viewallvillas" element={<ViewVillas />}></Route>
          <Route
            path="/selectedrestaurentitems"
            element={<PurchaseResItems />}
          ></Route>
          <Route
            path="/viewcustomersettings"
            element={<CustomerRestaurentSettings />}
          ></Route>
          <Route path="/yourhomedashboard" element={<OwnerHomePage />}></Route>
          <Route path="/selectedHome" element={<CusHomePageForHomes />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
