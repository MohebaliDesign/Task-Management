import { redirect } from "next/navigation";

/**
 * The Meeting Categories list now lives at the top-level «/meetings» route, so
 * the old «/meetings/spaces» path just forwards there. Kept so any existing
 * links/bookmarks don't 404.
 */
export default function MeetingSpacesRedirect() {
  redirect("/meetings");
}
