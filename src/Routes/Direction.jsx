import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Login from "../Login/login";
import AddReport from "../components/addReport";
import ErrorPage from "../Error/ErrorPage";
import Header from "../components/Header";
import Users from "../components/users";

function Direction() {
  return (
    <div>
     <Routes>
      {/* Login sahifasi Header ichida bo‘lmaydi */}
      <Route path="/login" element={<Login />} />

      {/* Header ichida barcha sahifalar */}
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/addReport" element={<AddReport />} />
        <Route path="/users" element={<Users />} />
      </Route>
      <Route path="*" element={<ErrorPage />} /> {/* 404 sahifa */}
    </Routes>
    </div>
  );
}

export default Direction;
