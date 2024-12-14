import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from dist/az-now/browser with proper MIME types
app.use(
  express.static(path.join(__dirname, "dist/az-now/browser"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      }
    },
  })
);

app.post("/api/quote", async (req, res) => {
  try {
    const { ressourceId, ...rest } = req.body;

    const response = await fetch(
      `https://as-leben.allianz.de/koop-allianz/multiofferlebenservice/${ressourceId}/quickquotegm`,
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=UTF-8",
          Origin: "https://www.allianz.de",
          Referer: "https://www.allianz.de/",
          Host: "as-leben.allianz.de",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        // body: JSON.stringify({ ...rest, betrag: 600, vertragslaufzeit: 47 }),
        body: JSON.stringify({
          vertrag: {
            produkt: "SBV_BASIS",
            beginn: rest.vertrag.beginn,
            raucherstatus: rest.vertrag.raucherstatus,
            vertragslaufzeit: rest.vertrag.vertragslaufzeit,
            betrag: rest.vertrag.betrag,
          },
          vp: {
            geburtsdatum: rest.vp.geburtsdatum,
            berufeingabe: rest.vp.berufeingabe,
          },
          extras: {
            mandant: "SBAZ",
            mandantTracking: "AZDE",
            mandantPega: "SBAZ",
            as: "sbv",
            partner: "azde",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/resourceId", async (req, res) => {
  try {
    const response = await fetch(
      "https://as-leben.allianz.de/koop-allianz/multiofferlebenservice/resourceId",
      {
        headers: {
          Accept: "application/json",
          Origin: "https://www.allianz.de",
          Referer: "https://www.allianz.de",
          Host: "as-leben.allianz.de",
        },
      }
    );

    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/berufeliste", async (req, res) => {
  try {
    const response = await fetch(
      "https://as-leben.allianz.de/koop-allianz/multiofferlebenservice/berufeliste",
      {
        headers: {
          Accept: "application/json",
          Origin: "https://www.allianz.de",
          Referer: "https://www.allianz.de",
          Host: "as-leben.allianz.de",
        },
      }
    );

    if (!response.ok) {
      console.error("Error:", response.status, response.statusText);
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Catch all other routes and return the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/az-now/browser/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
