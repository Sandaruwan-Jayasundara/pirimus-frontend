// AppSidebar.tsx
"use client";
import { usePathname } from "next/navigation";

import {
  Building,
  Calendar,
  ClipboardList,
  DoorClosed,
  DoorOpen,
  Home,
  Hourglass,
  List,
  Stethoscope,
  TimerOff,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import Link from "next/link";
import { NavUser } from "@/components/sidebar/nav-user";
import { useAuth } from "@/context/AuthContext";

// Define menu items with roles that can access them
const menuItems = [
  {
    title: "Admin Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["ADMIN"], // Accessible by both roles
  },
  {
    title: "Psychologist Dashboard",
    url: "/psychologist-dashboard",
    icon: Home,
    roles: ["PSYCHOLOGIST"], // Accessible by both roles
  },
  {
    title: "Psychologist Management",
    url: "/psychologist",
    icon: Stethoscope,
    roles: ["ADMIN"], // Only ADMIN
  },
  {
    title: "Appointment Management",
    url: "/appointment",
    icon: Calendar,
    roles: ["ADMIN", "PSYCHOLOGIST"],
  },
  {
    title: "Completed Appointment",
    url: "/completed-appointment",
    icon: CheckCircle,
    roles: ["ADMIN"],
  },
  {
    title: "Patient Management",
    url: "/patient",
    icon: Users,
    roles: ["PSYCHOLOGIST"],
  },
  {
    title: "Patient Management",
    url: "/admin-patient",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Room Management",
    url: "/room",
    icon: DoorClosed,
    roles: ["ADMIN"],
  },
  {
    title: "Room Appointment",
    url: "/room-appointment",
    icon: DoorOpen,
    roles: ["PSYCHOLOGIST"],
  },
  {
    title: "Branch Management",
    url: "/branch",
    icon: Building,
    roles: ["ADMIN"], // Only ADMIN
  },
  {
    title: "Working Hours",
    url: "/workingHours",
    icon: Hourglass,
    roles: ["PSYCHOLOGIST"], // Only PSYCHOLOGIST
  },
  {
    title: "Blocked Timing",
    url: "/blockedTiming",
    icon: TimerOff,
    roles: ["ADMIN"], // Only PSYCHOLOGIST
  },
  ,
  {
    title: "Payment Records",
    url: "/payment-records",
    icon: List,
    roles: ["PSYCHOLOGIST"], // Only PSYCHOLOGIST
  },
  {
    title: "Payment Record",
    url: "/commission-list",
    icon: ClipboardList,
    roles: ["ADMIN"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // inside your component
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  // Filter menu items based on the user's role
  const filteredItems = menuItems.filter((item) =>
    (item?.roles ?? []).includes(user?.role || "")
  );

  return (
    <Sidebar
      className={`sidebar ${open ? "open" : "closed"}`}
      variant="floating"
      {...props}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems?.map((item) => {
                const isActive = pathname === item?.url;

                return (
                  <SidebarMenuItem key={item?.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-green-500 text-white" : ""}
                    >
                      {item?.url && (
                        <Link href={item.url}>
                          {item?.icon && <item.icon />}
                          <span>{item?.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
