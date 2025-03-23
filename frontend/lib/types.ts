// Server information type
export interface ServerInfoType {
  title: string
  description?: string
  contact?: string
  default?: string
  api_roots?: string[]
  version: string
}

// Collection type
export interface CollectionType {
  id: string
  title: string
  description?: string
  can_read: boolean
  can_write: boolean
  media_types?: string[]
  added: string
}

// Object type (STIX object)
export interface ObjectType {
  id: string
  type: string
  created: string
  modified: string
  name?: string
  description?: string
  pattern?: string
  valid_from?: string
  valid_until?: string
  indicator_types?: string[]
  is_family?: boolean
  malware_types?: string[]
  object_refs?: string[]
  [key: string]: any // For other STIX properties
}

