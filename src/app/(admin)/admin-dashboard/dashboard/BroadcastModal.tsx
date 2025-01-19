"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import axios from "axios";
import { useSession } from "next-auth/react";

const BroadcastMail = () => {
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [messageToSend, setMessageToSend] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const handleSubmit = async () => {
    if (!organizationEmail || !recipients || !subject || !messageToSend) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://iaiiea.org/api/sandbox/admin/send_broadcast_mail",
        {
          organization_email: organizationEmail,
          recipients,
          subject,
          message_to_send: messageToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      alert("Broadcast mail sent successfully!");
      console.log(response.data);
      // Reset form
      setOrganizationEmail("");
      setRecipients("");
      setSubject("");
      setMessageToSend("");
    } catch (error) {
      console.error("Error sending broadcast mail:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError ( "An error occurred while sending the mail.")
      }
   
    } 
    // catch (error) {
    //   console.error(error);
    //   if (error instanceof Error) {
    //     setError(error.message);
    //   } else {
    //     setError("An error occurred while creating the schedule");
    //   }
    // }
    
    
    finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] font-semibold text-white px-5 py-3 rounded-lg text-[17px]">
          Send Broadcast Mail
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[725px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50">
          <h1 className="text-2xl text-center">Broadcast Mail</h1>

          <div className="grid gap-4 mt-5">
            <div className="max-w-[60%]">
              <label htmlFor="organizationEmail" className="block mb-2">
                Organization's Email Address
              </label>
              <input
                id="organizationEmail"
                value={organizationEmail}
                onChange={(e) => setOrganizationEmail(e.target.value)}
                className="w-full h-[35px] px-[10px] rounded-[4px] shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Enter organization's email address"
              />
            </div>

            <div className="max-w-[60%]">
              <label htmlFor="recipients" className="block mb-2">
                Recipients
              </label>
              <input
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="w-full h-[35px] px-[10px] rounded-[4px] shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Enter recipients (comma-separated)"
              />
            </div>

            <div className="max-w-[60%]">
              <label htmlFor="subject" className="block mb-2">
                Subject
              </label>
              <input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-[35px] px-[10px] rounded-[4px] shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Enter email subject"
              />
            </div>

            <div className="max-w-[60%]">
              <label htmlFor="messageToSend" className="block mb-2">
                Message
              </label>
              <textarea
                id="messageToSend"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                className="w-full h-[100px] px-[10px] rounded-[4px] shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                placeholder="Enter your message"
              />
            </div>
          </div>

          <div className="mt-[25px] flex justify-end gap-[10px]">
            <Dialog.Close asChild>
              <button className="bg-gray-200 text-gray-800 hover:bg-gray-300 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#203a87] text-white hover:bg-opacity-90 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BroadcastMail;
