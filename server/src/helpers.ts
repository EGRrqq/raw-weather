interface ILink {
  base_link: string;
  route: string;
  api_key: string;
  other_keys: string[];
}

export const createLink = (settings: ILink) =>
  `${settings.base_link}/${settings.route}/?api_key=${
    settings.api_key
  }&${settings.other_keys.join("&")}`;
