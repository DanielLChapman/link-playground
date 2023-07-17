export type Session = {
    itemId: string;
    listKey: string;
    data: {
      name: string;
      role: {
        id: string;
        name: string;
        canManageAllLinks: boolean;
        canSeeOtherPeople: boolean;
        canEditOtherPeople: boolean;
        canManagePeople: boolean;
        canManageRoles: boolean;
        canUseAdminUI: boolean;
      };
    };
  };
  
  type AccessArgs = {
    session?: Session;
  };
  
  // this function checks only that a session actually exists, nothing else
  export function isSignedIn({ session }: AccessArgs) {
    return Boolean(session);
  }
  
  /*
    Permissions are shorthand functions for checking that the current user's role has the specified
    permission boolean set to true
  */
  export const permissions = {
    canManageAllLinks: ({ session }: AccessArgs) => session?.data.role?.canManageAllLinks ?? false,
    canManagePeople: ({ session }: AccessArgs) => session?.data.role?.canManagePeople ?? false,
    canManageRoles: ({ session }: AccessArgs) => session?.data.role?.canManageRoles ?? false,
    // TODO: add canViewAdminUI
  };
  
  /*
    Rules are logical functions that can be used for list access, and may return a boolean (meaning
    all or no items are available) or a set of filters that limit the available items
  */
  export const rules = {
    canManageAllLinks: ({ session }: AccessArgs) => {
      
      if (!session) return false;
  
      // can manage every todo?
      if (session.data.role?.canManageAllLinks) return true;
  
      // default to only managing your own todos
      return { owner: { id: { equals: session.itemId } } };
    },
    canReadPeople: ({ session }: AccessArgs) => {
      if (!session) return false;
  
      // can see everyone?
      if (session.data.role?.canSeeOtherPeople) return true;
  
      // default to only seeing yourself
      return { id: { equals: session.itemId } };
    },
    canUpdatePeople: ({ session }: AccessArgs) => {
      if (!session) return false;
  
      // can update everyone?
      if (session.data.role?.canEditOtherPeople) return true;
  
      // default to only updating yourself
      return { id: { equals: session.itemId } };
    },
  };