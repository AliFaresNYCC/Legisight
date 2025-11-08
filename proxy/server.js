import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/proxy/matters", async (req, res) => {
  try {
    // get past 6 months date
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const toDate = today.toISOString().split(".")[0] + "Z";
    const fromDate = sixMonthsAgo.toISOString().split(".")[0] + "Z";

    // fetch data from legistar with filters
    const response = await axios.get(
      `https://webapi.legistar.com/v1/nyc/matters?$filter=MatterIntroDate ge datetime'${fromDate}' and MatterIntroDate le datetime'${toDate}'&$orderby=MatterIntroDate desc&$top=10&token=Uvxb0j9syjm3aI8h46DhQvnX5skN4aSUL0x_Ee3ty9M.ew0KICAiVmVyc2lvbiI6IDEsDQogICJOYW1lIjogIk5ZQyByZWFkIHRva2VuIDIwMTcxMDI2IiwNCiAgIkRhdGUiOiAiMjAxNy0xMC0yNlQxNjoyNjo1Mi42ODM0MDYtMDU6MDAiLA0KICAiV3JpdGUiOiBmYWxzZQ0KfQ`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch matters" });
  }
});
app.get("/proxy/filtered-matters", async (req, res) => {
  try {
    const { filter } = req.query;
    const response = await axios.get(
      `https://webapi.legistar.com/v1/nyc/matters?token=Uvxb0j9syjm3aI8h46DhQvnX5skN4aSUL0x_Ee3ty9M.ew0KICAiVmVyc2lvbiI6IDEsDQogICJOYW1lIjogIk5ZQyByZWFkIHRva2VuIDIwMTcxMDI2IiwNCiAgIkRhdGUiOiAiMjAxNy0xMC0yNlQxNjoyNjo1Mi42ODM0MDYtMDU6MDAiLA0KICAiV3JpdGUiOiBmYWxzZQ0KfQ&$filter=${filter}&$top=10`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch matters" });
  }
});

app.get("/proxy/matterhistory/:matterId", async (req, res) => {
  const { matterId } = req.params;
  try {
    const response = await axios.get(
      `https://webapi.legistar.com/v1/nyc/matters/${matterId}/histories?AgendaNote=0&MinutesNote=0&token=Uvxb0j9syjm3aI8h46DhQvnX5skN4aSUL0x_Ee3ty9M.ew0KICAiVmVyc2lvbiI6IDEsDQogICJOYW1lIjogIk5ZQyByZWFkIHRva2VuIDIwMTcxMDI2IiwNCiAgIkRhdGUiOiAiMjAxNy0xMC0yNlQxNjoyNjo1Mi42ODM0MDYtMDU6MDAiLA0KICAiV3JpdGUiOiBmYWxzZQ0KfQ`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch matter history" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
