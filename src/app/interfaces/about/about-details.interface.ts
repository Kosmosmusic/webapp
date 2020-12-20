/**
 * Application about links interface with initialization.
 */
export interface IAboutLinks {
  bandcamp: string;
  facebook: string;
  instagram: string;
  mixcloud: string;
  soundcloud: string;
  twitter: string;
  rss: string;
  youtube: string;
}

export interface IPoweredBy {
  name: string;
  logo: string;
}

/**
 * Application about details interface with initialization.
 */
export interface IAboutDetails {
  links: IAboutLinks;
  soundcloudUserId: string;
  text: string;
  title: string;
  widgetLink: string;
  poweredBy: IPoweredBy[];
}
