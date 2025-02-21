"use client";

import { ACTIVATION_RESTAURANT } from "@/graphql/actions/activation.action";
import { useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function ActivateRestaurant() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activationMutation, { loading, data }] = useMutation(
    ACTIVATION_RESTAURANT,
    {
      onError: (error) => {
        setErrorMessage(error.message);
      },
    }
  );
  const token = searchParams.get("verify");
  const code = searchParams.get("code");

  useEffect(() => {
    if (token && code) {
      activationMutation({ variables: { token, code } });
    }
  }, [token, code]);

  if(data){
    setTimeout(() => {
      alert('click ok to close the page')
      window.close()
    },3000)
  }

  return (
    <div className="w-full h-full bg-slate-950">
      <div className="flex justify-center items-center h-screen">
        {loading && !errorMessage && <p>Activation may take some time, please wait.</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {data && !errorMessage && <p>{data.activateRestaurant.message} ✅</p>}
      </div>
    </div>
  );
}

export default ActivateRestaurant;
