// resumeFile.js in your Sanity schemas folder
export default {
  name: 'resumeFile',
  title: 'Resume PDF',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Resume PDF'
    },
    {
      name: 'resumePdf',
      title: 'Resume PDF File',
      type: 'file',
      options: {
        accept: '.pdf'
      }
    }
  ]
}