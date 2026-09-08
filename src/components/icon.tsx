import type { Icon as IconsaxIcon } from "iconsax-react";
import {
  Home2,
  Category,
  TaskSquare,
  Activity as ActivityIcon,
  DocumentText,
  Calendar,
  People,
  Flag,
  Warning2,
  Danger,
  ShieldTick,
  MessageText1,
  Judge,
  Hierarchy,
  Signpost,
  Clock,
  Timer1,
  Link1,
  Add,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  CloseCircle,
  TickCircle,
  TickSquare,
  Minus,
  More,
  SearchNormal1,
  Moon,
  Sun1,
  Setting2,
  Send2,
  Edit2,
  Trash,
  InfoCircle,
  Chart2,
  ProfileTick,
  ClipboardText,
  Verify,
  Cup,
  Note1,
  Diagram,
  ProfileCircle,
  ArchiveBook,
  Import,
  Figma,
  Code,
  GoogleDrive,
  Slack,
  Global,
  Copy,
  Element3,
  RowVertical,
} from "iconsax-react";

/**
 * Iconsax is the single product icon system (brief §13). Icons are referenced
 * ONLY through this map so the variant stays consistent and no other icon
 * library leaks in. Default variant is a light stroke ("Linear"); use Bold only
 * where hierarchy demands it via the `variant` prop on <AppIcon/>.
 */
export type IconsaxComponent = IconsaxIcon;

export const icons = {
  dashboard: Home2,
  projects: Category,
  actions: TaskSquare,
  activity: ActivityIcon,
  meetings: DocumentText,
  calendar: Calendar,
  people: People,
  flag: Flag,
  risk: Warning2,
  blocker: Danger,
  approval: ShieldTick,
  comment: MessageText1,
  decision: Judge,
  dependency: Hierarchy,
  milestone: Signpost,
  clock: Clock,
  timer: Timer1,
  link: Link1,
  add: Add,
  chevronDown: ArrowDown2,
  chevronRight: ArrowRight2,
  chevronLeft: ArrowLeft2,
  close: CloseCircle,
  check: TickCircle,
  checkSquare: TickSquare,
  minus: Minus,
  more: More,
  search: SearchNormal1,
  moon: Moon,
  sun: Sun1,
  settings: Setting2,
  send: Send2,
  edit: Edit2,
  trash: Trash,
  info: InfoCircle,
  metric: Chart2,
  reviewer: ProfileTick,
  clipboard: ClipboardText,
  verify: Verify,
  trophy: Cup,
  note: Note1,
  overview: Diagram,
  profile: ProfileCircle,
  archive: ArchiveBook,
  import: Import,
  figma: Figma,
  repo: Code,
  drive: GoogleDrive,
  slack: Slack,
  globe: Global,
  copy: Copy,
  grid: Element3,
  table: RowVertical,
} satisfies Record<string, IconsaxComponent>;

export type IconName = keyof typeof icons;

export interface AppIconProps {
  name: IconName;
  size?: number;
  variant?: "Linear" | "Outline" | "Bold" | "Bulk" | "Broken" | "TwoTone";
  className?: string;
  /** Decorative by default; supply a label to expose it to assistive tech. */
  label?: string;
}

export function AppIcon({ name, size = 20, variant = "Linear", className, label }: AppIconProps) {
  const Cmp = icons[name];
  return (
    <Cmp
      size={size}
      variant={variant}
      className={className}
      color="currentColor"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
