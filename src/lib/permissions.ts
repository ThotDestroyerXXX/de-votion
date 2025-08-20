import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  workspace: ["edit", "invite", "delete", "create teamspace", "view"],
} as const;

export const ac = createAccessControl(statement);

const member = ac.newRole({
  workspace: ["view"],
  ...memberAc.statements,
});

const admin = ac.newRole({
  workspace: ["edit", "create teamspace", "invite", "view"],
  ...adminAc.statements,
});

const owner = ac.newRole({
  workspace: ["edit", "invite", "delete", "create teamspace", "view"],
  ...ownerAc.statements,
});

export const roles = {
  member,
  admin,
  owner,
};
