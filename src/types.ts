import {
  RichTextItemResponse,
  PersonUserObjectResponse,
  PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints'

import { Blocks } from '@notion-stuff/v4-types'

declare global {
  interface String {
    route: string,
    slug: string
  }
}

export type Properties = Partial<PageObjectResponse['properties']>

export interface Options {
  databaseId: string,
  notionAPIKey: string,
  debug?: boolean,
  draftMode?: boolean,
  refreshTimeout?: number, // in ms
  localCacheDirectory?: string
  rootUrl?: string | URL | undefined // Used to generate full path links,
  limiter?: { schedule: Function },
  plugins?: Array<Plugin>
}

export interface CMS {
  stages: Array<string>,
  lastUpdateTimestamp?: number,
  metadata: {
    rootUrl?: string | URL | undefined,
    databaseId: string
  },
  routes: Array<string | Array<string>>,
  tags: Array<string>,
  tagGroups: Record<string, Array<string>>
  siteData: Record<string, Page> | string
}

export type PageContent = {
  name?: string,
  path?: string,
  url?: string,
  _ancestors: Page[],
  otherProps?: PageObjectResponse['properties'],
  _notion?: {
    parent?: PageContent,
    id: string,
    last_edited_time: string,
  }
  authors?: Array<string>,
  slug?: string,
  tags?: Array<string>,
  coverImage?: string,
  content?: string,
  metaTitle?: string,
  metaDescription?: string
}

export type Route = {
  [key: string]: PageContent
}

export type Page = PageContent | (PageContent & Route)

// Directly stolen from PageObjectResponse Record Type in notionClient/API-endpoints.ts
export type PageObjectTitle = { type: "title"; title: Array<RichTextItemResponse>; id: string }

export type PageObjectRelation = { type: "relation"; relation: Array<{ id: string }>; id: string }

export type PageObjectUser = {
  type: "people"
  people: Array<PersonUserObjectResponse>
  id: string
}

export type PageMultiSelect = {
  type: "multi_select"
  multi_select: Array<{
    id: string;
    name: string;
    color: string;
  }>
  id: string
}

export type PageSelect = {
  type: "select";
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
  id: string;
}

export type PageRichText = {
  type: "rich_text";
  rich_text: Array<RichTextItemResponse>;
  id: string;
}

export type Cover = { type: "external"; external: { url: string } } | { type: "file"; file: { url: string; expiry_time: string } } | null

export type RouteObject = [string, object]

export type PluginPassthrough = Blocks | CMS | Page | string

export interface Plugin {
  name: string,
  core: boolean,
  hook: 'pre-tree' | 'pre-parse' | 'post-parse' | 'during-tree' | 'post-tree'
  exec: (context: PluginPassthrough) => PluginPassthrough
}