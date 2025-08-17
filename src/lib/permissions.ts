import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  workspace: ["edit", "invite", "delete", "create teamspace", "view"],
} as const;

export const ac = createAccessControl(statement);

const member = ac.newRole({
  workspace: ["view"],
});

const admin = ac.newRole({
  workspace: ["edit", "create teamspace", "invite", "view"],
});

const owner = ac.newRole({
  workspace: ["edit", "invite", "delete", "create teamspace", "view"],
});

export const roles = {
  member,
  admin,
  owner,
};
