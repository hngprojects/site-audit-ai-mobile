export type Country = {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [languageCode: string]: {
        official: string;
        common: string;
      };
    };
  };

  flags: {
    png: string;
    svg: string;
    alt?: string;
  };

  cca2: string;

  region: string;

  languages?: Record<string, string>;
};

export interface Slide {
  id: string;
  image: any;
  title: string;
  subtitle: string;
}
