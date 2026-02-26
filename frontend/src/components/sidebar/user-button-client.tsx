"use client";

import dynamic from "next/dynamic";
import type React from "react";

type UserButtonProps = React.ComponentProps<
  typeof import("@daveyplate/better-auth-ui")["UserButton"]
>;

const UserButtonNoSSR = dynamic(
  () => import("@daveyplate/better-auth-ui").then((m) => m.UserButton),
  {
    ssr: false,
    loading: () => (
      <div className="h-9 w-full rounded-md border border-muted-foreground/20 bg-muted/30" />
    ),
  }
);

export default function UserButtonClient(props: UserButtonProps) {
  return <UserButtonNoSSR {...props} />;
}
