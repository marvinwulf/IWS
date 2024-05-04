export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const si = await import("systeminformation");
    const fs = await import("fs");

    try {
      const cpuInfo = { CPU: await si.cpu(), RAM: await si.memLayout() };

      fs.writeFileSync("./public/staticinfo.json", JSON.stringify(cpuInfo));
      console.log("Sys information gathered and saved successfully.");

      return { props: {} };
    } catch (error) {
      console.error("Error gathering and saving Sys information:", error);
      return { props: { error: "Internal Server Error" } };
    }
  }
}
