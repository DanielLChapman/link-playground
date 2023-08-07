export type Session = {
    itemId: string;
    listKey: string;
    data: {
      username: string;
    };
  };
  
export type User = {
  id: string; // Most ORM tools auto-generate an ID, but its inclusion here depends on your ORM setup
  username: string;
  password: string;
  email: string;
  links: ShortenedLink[]; // An array of shortened links associated with the user
  rootNodes: TreeNode[]; // An array of root tree nodes associated with the user
  createdAt: Date;
  role: Role[]; // Assuming a Role interface exists; this represents the roles associated with a user
  // Add other fields if required
}

type TreeNodeType = 'Category' | 'Link';

export type TreeNode = {
  id: string;
  type: TreeNodeType;
  name: string;
  link?: ShortenedLink; // Optional because not all nodes will be links
  owner: User;
  parent?: TreeNode; // Optional since root nodes won't have parents
  children?: TreeNode[]; // Child nodes
  order: number;
  createdAt: Date;
}

export type ShortenedLink = {
  id: string;
  originalURL: string;
  shortenedURL: string;
  isPrivate: boolean;
  privatePass?: string; // Optional since it might not always be given even if the link is private
  owner: User;
  treeNode?: TreeNode[];
  clicks: number;
  createdAt: Date;
  name?: string; 
}

export type Role = {
  id?: string; // Assuming an auto-generated ID as before
  name: string;
  canDeleteLink: boolean;
  canManageAllLinks: boolean;
  canSeeOtherPeople: boolean;
  canEditOtherPeople: boolean;
  canManagePeople: boolean;
  canManageRoles: boolean;
  canUseAdminUI: boolean;
  canManageTrees: boolean;
  canManageOthersTrees: boolean;
  assignedTo: User[]; // Based on the relationship with User
  // Add other fields if required
}