
const core = require('@actions/core')
const exec = require('@actions/exec')
const artifact = require('@actions/artifact')
const fs = require('fs')

const uploadArtifact = async (file, schema) => {
  fs.writeFileSync(file, schema)
  const client = artifact.create()
  const options = { continueOnError: false }
  return await client.uploadArtifact(file, [file], __dirname, options)
}

const rover = async (args = []) => {
  let schema = ""
  const stdout = (data) => schema += data.toString()
  const listeners = { stdout }
  const options = { listeners }
  await exec.exec("/root/.rover/bin/rover", args, options)
  return schema
}

const setOutput = (path, schema) => {
  const encoded = Buffer.from(schema).toString('base64')
  core.setOutput('schema', encoded)
}

async function run() {
  try {
    const federated = core.getInput('federated')
    const subgraph = core.getInput('subgraph')
    const server = core.getInput('server')
    const schema = await rover([
      federated ? 'subgraph' : 'graph',
      'introspect',
      server
    ])
    const filename = federated ? `${subgraph}.graphql` : `graph.graphql`
    await uploadArtifact(filename, schema)
    setOutput(path, schema)
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()