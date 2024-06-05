import React from "react";
import Image from "next/image";

import { Drawer, Input, Typography, IconButton, Textarea } from "@material-tailwind/react";

interface Props {
  opend: boolean;
  setOpend: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ContactDrawer({ opend, setOpend }: Props) {
  const toggleDrawer = () => setOpend((cur) => !cur);

  return (
    <Drawer open={opend} onClose={toggleDrawer} placement="right" className="border rounded-l-lg">
      <div className="px-3">
        <div className="flex items-center justify-start px-1 pb-4 pt-4">
          <IconButton variant="text" color="blue-gray" onClick={toggleDrawer}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>

          <Typography variant="h5" className="font-light ml-2 text-ms-fg">
            Kontaktieren Sie Uns
          </Typography>
        </div>

        <div className="p-4 border-y border-y-ms-grayscale">
          <Typography variant="small" className="font-light text-ms-grayscale-3">
            Ihr Anliegen ist uns wichtig. <br />
            Bitte geben Sie Ihre Kontaktdaten ein und beschreiben Sie Ihr Anliegen. <br />
            Wir werden uns umgehend mit Ihnen in Verbindung setzen.
          </Typography>
        </div>

        <form className="flex flex-col gap-6 p-4">
          <div className="-mb-2">
            <Typography variant="h6" className="text-ms-fg">
              Ihre Kontaktdaten
            </Typography>
            <Typography className="text-ms-grayscale-3 text-xs">Mit * markierte Felder sind Pflichtfelder</Typography>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              type="name"
              placeholder="Ihr Name *"
              className="!border !border-ms-grayscale-1 bg-ms-hbg text-ms-fg shadow-lg shadow-ms-grayscale-4/5 placeholder:text-ms-grayscale-2 placeholder:opacity-100 focus:!border-ms-fg"
              labelProps={{
                className: "hidden",
              }}
              maxLength={50}
            />
            <Input
              type="email"
              placeholder="Ihre Email Addresse *"
              className="!border !border-ms-grayscale-1 bg-ms-hbg text-ms-fg shadow-lg shadow-ms-grayscale-4/5 placeholder:text-ms-grayscale-2 placeholder:opacity-100 focus:!border-ms-fg"
              maxLength={50}
              labelProps={{
                className: "hidden",
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Input
              type="subject"
              placeholder="Betreff *"
              className="!border !border-ms-grayscale-1 bg-ms-hbg text-ms-fg shadow-lg shadow-ms-grayscale-4/5 placeholder:text-ms-grayscale-2 placeholder:opacity-100 focus:!border-ms-fg"
              labelProps={{
                className: "hidden",
              }}
              maxLength={50}
            />
            <Textarea
              placeholder="Nachricht *"
              rows={6}
              className="!border !border-ms-grayscale-1 bg-ms-hbg text-ms-fg shadow-lg shadow-ms-grayscale-4/5 placeholder:text-ms-grayscale-2 placeholder:opacity-100 focus:!border-ms-fg"
              labelProps={{
                className: "hidden",
              }}
              maxLength={140}
            />
          </div>
          <button type="submit" className="button-2 w-32 shadow-lg shadow-gray-900/5 sa-lg">
            Senden
            <i className="mdi mdi-send pl-2" id="send-icon"></i>
          </button>
        </form>
      </div>

      <div className="flex items-center justify-end pt-20 opacity-45">
        <Image alt="Logo" src="/mslogomonolight.svg" width={250} height={150} />
      </div>
    </Drawer>
  );
}
