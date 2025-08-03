import { client } from './sanity'

export async function getExperience() {
  return client.fetch(`
    *[_type == "experience"] | order(order asc, startDate desc) {
      _id,
      jobTitle,
      company,
      startDate,
      endDate,
      current,
      location,
      bulletPoints,
      order
    }
  `)
}

export async function getResumeSections() {
  return client.fetch(`
    *[_type == "resumeSection"] | order(order asc) {
      _id,
      title,
      items,
      order,
      sectionType
    }
  `)
}

export async function getResumeFile() {
  const query = `*[_type == "resumeFile"][0] {
    "url": resumePdf.asset->url,
    "originalFilename": resumePdf.asset->originalFilename
  }`
  
  try {
    const resumeFile = await client.fetch(query)
    return resumeFile
  } catch (error) {
    console.error('Error fetching resume file:', error)
    return null
  }
}