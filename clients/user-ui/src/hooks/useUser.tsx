"use client";

import { GET_LOGGED_IN_USER } from "@/graphql/actions/getuser.action";
import Cookies from "js-cookie";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

function useUser() {
  const { loading, data } = useQuery(GET_LOGGED_IN_USER);

  useEffect(() => {
    if (data?.getLoggedInUser.user) {
      localStorage.setItem("user", JSON.stringify(data?.getLoggedInUser.user));
      // Cookies.set("access_token_user", data?.getLoggedInUser.accessToken);
      // Cookies.set("refresh_token_user", data?.getLoggedInUser.refreshToken);
    }
  }, [data]);

  return { loading, data: data?.getLoggedInUser.user };
}

export default useUser;
