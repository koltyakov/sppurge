export interface IFolder {
  ItemCount: number;
  Name: string;
  ServerRelativeUrl: string;
  UniqueId: string;
  [key: string]: any;
}

export interface IFile {
  ModifiedBy: any;
  Length: string;
  Name: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
  TimeLastModified: string;
  UniqueId: string;
  [key: string]: any;
}

export interface IContent {
  files: IFile[];
  folders: IFolder[];
}
