
const core = require('@actions/core')
const exec = require('@actions/exec')
const artifact = require('@actions/artifact')
const fs = require('fs')
const path = require('path')

const uploadArtifact = async (name, path) => {
  const client = artifact.create()
  const options = { continueOnError: false }
  return await client.uploadArtifact(name, [path], __dirname, options)
}

const saveFile = (name, schema) => {
  const file = path.join(__dirname, `/${name}`)
  fs.writeFileSync(file, schema)
  return file
}

const rover = async (args = []) => {
  let schema = ""
  const stdout = (data) => schema += data.toString()
  const listeners = { stdout }
  const options = { listeners }
  await exec.exec("/root/.rover/bin/rover", args, options)
  return schema
}

const setOutput = (schema) => {
  const encoded = Buffer.from(schema).toString('base64')
  core.setOutput('schema', encoded)
}

const parseHeaders = (rawHeaders) => {
  if (rawHeaders === '') return []

  try {
    const headers = JSON.parse(rawHeaders)
    return Object.entries(headers).reduce((acc, header) => {
      return acc.concat(['--header', header.join(':')])
    }, [])
  } catch(error) {
    core.error('Failed to parse headers input, is it valid JSON?')
    throw error
  }
}

const getInput = () => {
  const federated = core.getInput('federated')
  const subgraph = core.getInput('subgraph')
  const server = core.getInput('server')
  const rawHeaders = core.getInput('headers')
  return { federated, subgraph, server, headers: parseHeaders(rawHeaders) }
}

async function run() {
  try {
    const { federated, subgraph, server, headers } = getInput()
    const schema = await rover([
      federated ? 'subgraph' : 'graph',
      'introspect',
      server,
      ...headers
    ])
    const filename = federated ? `${subgraph}.graphql` : `graph.graphql`
    const file = saveFile(filename, schema)
    await uploadArtifact(filename, file)
    setOutput(schema)
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()