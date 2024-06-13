import React from "react";
import { Card, Typography, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";

const menuItems = [
  {
    title: "Admin Login",
    description: "Zugriff auf Steuerelemente erhalten und Einstellungen an den IWS Töpfen, sowie dem Server vornehmen.",
  },
  {
    title: "Datenbank",
    description: "Die lokale IWS Datenbank einsehen, und einzelne Messpunkte direkt unaufbereitet auswerten.",
  },
];
export default function CenterMenu() {
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <Menu open={openMenu} /*handler={setOpenMenu}*/ allowHover>
      <MenuHandler>
        <div className="nav-box mb-0.5">
          <div className="flex items-center justify-end -mb-0.5">
            <div className="pr-0.5 -ml-1.5">
              <i className={`mdi mdi-menu-down text-ms-accent-3 transition-transform ${openMenu ? "rotate-180" : ""}`}></i>
            </div>
            <text className="pr-0.25 select-none font-light text-lg">IWS Dashboard</text>
          </div>
        </div>
      </MenuHandler>

      <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid border-ms-grayscale">
        <Card
          shadow={false}
          className="col-span-3 flex h-full w-full items-center justify-center rounded-md p-4 bg-ms-fg sa-sm hover:bg-ms-grayscale-3 transition-all duration-500 outline-none select-none"
        >
          <Typography variant="h4" className="pr-9 text-ms-hbg">
            Willkommen!
          </Typography>
          <Typography variant="small" className="px-1 pt-2 text-ms-hbg">
            Dies ist die Zentralsteuerung für das Intelligent Watering System von MS Solutions. IWS Netzwerke können hier eingesehen werden.
          </Typography>
        </Card>

        <ul className="col-span-4 flex w-full flex-col gap-1 outline-none">
          {menuItems.map(({ title, description }) => (
            <a href="#" key={title}>
              <MenuItem className="hover-default">
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  {title}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {description}
                </Typography>
              </MenuItem>
            </a>
          ))}
        </ul>
      </MenuList>
    </Menu>
  );
}
