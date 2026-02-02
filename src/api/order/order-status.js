// import { useCallback } from "react";
// import { useCallback } from "react";
import axios from "axios";
import { useCallback } from "react";

export const useSendSampleMailAPI = () => {
  const sendSampleMail = useCallback(async ({ user, dmlData, orderId }) => {
    if (
      !user?.first_name ||
      !user?.email ||
      !dmlData?.date ||
      !dmlData?.time ||
      !dmlData?.dmlName ||
      !orderId
    ) {
      throw new Error("Missing required fields");
    }

    const payload = {
      userName: `${user.first_name} ${user.last_name}`,
      userEmail: user.email,
      date: dmlData.date,
      time: dmlData.time,
      dmlName: dmlData.dmlName,
      orderId,
    };

    const response = await axios.post(
      "https://api.swasthyapro.com/api/mail/send-sample-confirm-mail",
      payload
    );

    return response;
  }, []);

  return { sendSampleMail };
};


export const useSendsendSampleReceivedByLabMailAPI = () => {
  const sendSampleReceivedByLabMail = useCallback(async ({ user, dmlData, orderId }) => {
    if (
      !user?.first_name ||
      !user?.email ||
      !dmlData?.date ||
      !dmlData?.time ||
      !dmlData?.dmlName ||
      !orderId
    ) {
      throw new Error("Missing required fields");
    }

    const payload = {
      userName: `${user.first_name} ${user.last_name}`,
      userEmail: user.email,
      date: dmlData.date,
      time: dmlData.time,
      dmlName: dmlData.dmlName,
      orderId,
    };

    const response = await axios.post(
      "https://api.swasthyapro.com/api/mail/send-sample-recieved-by-lab-mail",
      payload
    );

    return response;
  }, []);

  return { sendSampleReceivedByLabMail };
};


