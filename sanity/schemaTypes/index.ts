import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {postType} from './postType'
import {authorType} from './authorType'
import {portfolio} from './portfolio' 
import qa from './qa'
import experience from './experince'
import resumeSection from './resumeSection'
import siteSettings from './siteSettings'
import footerSettings from './footerSettings'
import resumeFile from './resumeFile'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, postType, authorType, portfolio, qa, experience, resumeSection, siteSettings, footerSettings, resumeFile],
}
