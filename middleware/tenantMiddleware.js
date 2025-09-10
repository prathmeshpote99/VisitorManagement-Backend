
import { getTenantConnection } from "../utils/tenantManager.js";

export async function tenantMiddleware(req, res, next) {
  try {
    const host = req.headers.host; // e.g. hr.myvms.com
    const subdomain = host.split(".")[0]; // "hr"

    if (!subdomain) {
      return res.status(400).json({ error: "No subdomain found" });
    }

    req.tenant = await getTenantConnection(subdomain);

    next();
  } catch (err) {
    console.error("❌ Tenant middleware error:", err);
    res.status(500).json({ error: "Tenant DB connection failed" });
  }
}
