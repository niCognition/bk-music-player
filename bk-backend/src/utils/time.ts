import { DateTime } from "luxon";

export const nowInSwedenISO = (): string => {
  return DateTime.now().setZone("Europe/Stockholm").toISO() ?? "";
};
